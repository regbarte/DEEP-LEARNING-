# A MACHINE LEARNING FINAL PROJECT

A deep learning project that classifies rice varieties.


**BACKEND SETUP**

1. cd rice-classifier-ui/backend
2. Virtual environment
    python -m venv venv

    and to activate it

    - windows : venv\Scripts\activate
    - Mac/Linux: source venv/bin/activate


3. Dependencies
    pip install -r requirements.txt

4. Model Installment and set-up
   - Install the model at https://drive.google.com/drive/folders/1zNq_fJ-PdxA2JXKSZnf-kFSlnkjEJ8Ao?usp=drive_link
   - Place the .keras model in a folder named "model" at 'rice-classifier-ui/backend'

5. Run "uvicorn main:app --reload" at /rice-classifier-ui/backend


**FRONTEND SETUP**
Assuming u are at the root folder, go to the terminal and run sequentially:
  
1. cd rice-classifier-ui
2. npm install
3. npm run dev
