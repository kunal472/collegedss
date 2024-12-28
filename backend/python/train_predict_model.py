import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib

# Load the dataset
data = pd.read_csv('backend/python/sgpa_cgpa_dataset.csv')

# Features (SGPA of the last 5 semesters)
X = data[['Semester_1', 'Semester_2', 'Semester_3', 'Semester_4', 'Semester_5']].values

# Target (CGPA)
y = data['CGPA'].values

# Split data into training and test sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the model
model = LinearRegression()

# Train the model
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

# Save the trained model
joblib.dump(model, 'backend/python/cgpa_model.pkl')

print("Model trained and saved successfully!")
