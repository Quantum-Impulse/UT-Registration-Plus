import os
import json
import pickle
import re
import textwrap
import pandas as pd
from pypdf import PdfReader
from together import Together

class PDFGeneralizer: 

    def __init__(self, pdf_path, subject):
        
        self.reader = PdfReader(pdf_path)
        self.pages = self.reader.pages

        self.storage = []
        self.subject = subject

        self.client = Together(api_key=os.environ.get('TOGETHER_API_KEY'))
        self.template = """
        You are given text containing course information for a given department within the University of Texas.
        Return the result as a JSON list of dictionaries, where each dictionary represents a single course. 
        Each item contains the keys "course", "name", "description", "equivalents", "prerequisites", and "other_requirements".
        
        Example: 
        
        Given the following course information: "PHY 301. Mechanics. Designed for students who intend to major in science or mathematics. Three lecture hours a week for one semester. Only one of the following may be counted: Physical Science 303, Physics 301, 302K, 303K, 309K, 317K. Prerequisite: Credit with a grade of at least C- or registration in Mathematics 408D, 408L, or 408S, and Physics 101L; and an appropriate score on the physics assessment exam.

        Output: [{{"course": "PHY 301",
                  "name": "Mechanics", 
                  "description": "Designed for students who intend to major in science or mathematics. Three lecture hours a week for one semester.",
                  "equivalents": ["Physical Science 303", "Physics 301", "Physics 302K", "Physics 303K", "Physics 309K", "Physics 317K"],
                  "prerequisites": ["("Mathematics 408D", "Mathematics 408L", "Mathematics 408S"), "Physics 101L"], 
                  "other_reqs": "an appropriate score on the physics assessment exam"}}]
        
        Guidelines: 
        - Do NOT include explanations, comments, or any additional text.
        - ONLY return the output in JSON format.
        - Ensure the JSON is properly formatted and contains no trailing commas or unnecessary spaces.
        - Any courses indicated via "Credit with a grade of at least C- or registration for Physics 317K" are considered prerequisites, i.e., "Physics 317K" must be included in "prerequisites"
        - The "prerequisites" and "equivalents" keys must ONLY include course names, e.g. ["Physical Science 303", "Physics 301", "Physics 302K", "Physics 303K", "Physics 309K", "Physics 317K"]; do NOT include additional text.
        - Do NOT precede the prerequisites and equivalents with text such as "The following coursework with a grade of at least C- in each"; ONLY provide the list of courses.
        - Any requirements not explicitly related to a course, such as "an appropriate score on the physics assessment exam" must be put in "other_reqs" or "Consent of instructor and approval of an undergraduate adviser"
        - Do NOT include any information about prerequisites, equivalents, or other requirements in the "description" key
        - If the list of prerequisites or equivalents is structured as so: "Physical Science 303, Physics 301, 302K, 303K, 309K, 317K" where the word "Physics" is not indicated prior to 303K, 309K, and 317K, precede each of them with the word "Physics" such that it is "Physical Science 303", "Physics 301", "Physics 302K", "Physics 303K", "Physics 309K", "Physics 317K"

        Task: 
        Now generate outputted JSON objects for the given text: {file_text}

        JSON Output:
        """

    def chunk_text(self):
        self.pdf_text = [page.extract_text(extraction_mode="layout") for page in self.pages]

        sections = []

        for i, page in enumerate(self.pages): 
            text = page.extract_text(extraction_mode="layout")
            # add to prev section
            if text.startswith(self.subject) == False: 
                sections[-1] += text
            else: 
                sections.append(text)
        
        return sections

    def generate_output(self): 

        sections = self.chunk_text()
        print(len(sections))

        for section in sections: 
            response = self.client.chat.completions.create(
                model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
                messages=[{"role": "user", "content": self.template.format(file_text=section)}],
                max_tokens=8000
            )

            out = response.choices[0].message.content
            formatted_out = textwrap.dedent(out.strip())
            print(formatted_out)

            try: 
                out = json.loads(formatted_out)
                self.storage += out

            except json.JSONDecodeError:
                print("JSONDecoderError - see following output")
                print(formatted_out)
        
        return self.storage

if __name__ == "__main__":

    generalizer = PDFGeneralizer("/home/jasmine/PROJECTS/UT-Registration-Plus/degree_info/PHY - Physics _ The University of Texas at Austin.pdf", 
                                 "PHY")
    result = generalizer.generate_output()
    result_df = pd.DataFrame(result)
    print(result_df)
    result_df.to_csv("physics_results.csv", index=False)