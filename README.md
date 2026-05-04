# Rice Classifier Project

A deep learning project that classifies rice varieties from uploaded images using a FastAPI backend and a Next.js frontend.

## Project Structure

- `rice-classifier-ui/backend` - FastAPI API, preprocessing code, and model loading
- `rice-classifier-ui/app` - Next.js UI for uploading images and showing predictions
- `rice-classifier-ui/backend/model` - folder that should contain the trained `.keras` model file

## Setup

### Backend

1. Open a terminal in `rice-classifier-ui/backend`
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate it:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Place the trained model file in `rice-classifier-ui/backend/model/`
   - Pretrained model has phase 1 and phase 2 below to be downloaded and plugged into the file directory.
   - The backend expects: `model/best_rice_model.keras`
7. Start the API:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Open a terminal in `rice-classifier-ui`
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Make sure `.env.local` contains:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

## How to Use

1. Start the backend server first.
2. Start the frontend development server.
3. Open the app in your browser.
4. Upload a rice image in JPG or PNG format.
5. Click **Classify Grain** to get the predicted rice variety and confidence score.

If you upload a file that is not a JPG or PNG image, the UI will show an error message.

## How to Train

The project uses a trained rice classification model saved as a `.keras` file.

1. Use the Colab notebook linked below to train the model:
   - https://colab.research.google.com/drive/1uEa-6CFRqfvyMB2RwM09Oifn5Yfd5k3g?usp=sharing#scrollTo=v_4sVmYLS9UX
2. Train the model on the rice dataset.
3. Save the final trained model as `best_rice_model.keras`.
4. Place the saved model inside `rice-classifier-ui/backend/model/`.
5. Restart the backend server so it loads the new weights.

The backend class labels must stay in the same order as the training data:

- Arborio
- Basmati
- Ipsala
- Jasmine
- Karacadag

## Model Download

If you do not want to train the model yourself, you can download the pretrained model here:

- https://drive.google.com/drive/folders/1zNq_fJ-PdxA2JXKSZnf-kFSlnkjEJ8Ao?usp=drive_link

## Notes

- The backend API runs on `http://localhost:8000`
- The frontend reads the API URL from `NEXT_PUBLIC_API_URL`
- Make sure the backend is running before uploading an image
