## ✅ Python Version Requirement

* Select **Python 3.11.9**
* Newer versions may not work, so install **v3.11.9** specifically.

---

## 🖥️ Backend Setup Steps

### 1. Open the Backend Correctly

* Do **not** open VS Code at the same level as the frontend.
* First, locate the **api** folder.
* Right-click the folder → **Open in Terminal**
* Run:

```bash
code .
```

---

### 2. Setup Virtual Environment in Jupyter Notebook

1. Open **NN.ipynb**
2. Click **Select Kernel** (Top-right)
3. Choose:

   * **Select another kernel**
   * **Create Python Environment**
   * Select **venv**
   * Use **Python 3.11.9**

---

### 3. Install Dependencies (skip this, If you don't see error when creating venv)

Run:

```bash
pip install -r requirements.txt
```

---

### 4. Run Notebook Files

* Go back to:

  * **NN.ipynb**
  * **Code.ipynb**
* Click **Run All** in both notebooks.

---

### 5. Start Backend Server

Run:

```bash
uvicorn app.main:app --reload
```

---

## 🌐 Frontend Setup

### 1. Install Node Modules

Run:

```bash
npm i
```

---

### 2. Start Frontend Development Server

Run:

```bash
npm run dev
```

---

✅ Done! Your backend and frontend should now be running successfully.
