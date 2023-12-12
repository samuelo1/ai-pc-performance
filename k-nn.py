import numpy as np
import pandas as pd

from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import normalize
from sklearn.metrics import mean_absolute_error

'''
Train clf on training-test split of data X, y. Return the score and MAE.
'''
def train_mae(clf, X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    clf.fit(X_train, y_train)
    score = clf.score(X_test, y_test)
    y_pred = clf.predict(X_test)
    mae = mean_absolute_error(y_pred, y_test)
    return score, mae

df = pd.read_csv("TRAININGSLICEALL.csv")

# TRAINING 1: Full data set, unnormalized
ds = df.to_numpy()
print(ds.shape)
X = ds[:, 1:-1] # ignore 3dmark id
y = ds[:, -1]

knn = KNeighborsRegressor(n_neighbors=5)
score, mae = train_mae(knn, X, y)
print(f'default: score={score}, MAE={mae}')

# Result: score = 0.0, MAE = 8.087e-06

# TRAINING 2: Half of the data set, normalized
ds_half = normalize(ds[:len(ds)])
X = ds[:, 1:-1] # ignore 3dmark id
y = ds[:, -1]

knn2 = KNeighborsRegressor(n_neighbors=5)
score, mae = train_mae(knn2, X, y)
print(f'default: score={score}, MAE={mae}')

# Result: score = 1.0, MAE = 0.0