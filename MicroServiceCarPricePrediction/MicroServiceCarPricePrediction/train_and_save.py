import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# 1. تحميل وتجهيز البيانات
path = "automobile.csv" # خليه اسم الملف مباشرة وسيكون بجانبه
df = pd.read_csv(path, header=0)

# 2. الـ Encoding[cite: 1]
encoding_1 = pd.get_dummies(df["num-of-cylinders"], dtype=int)
df = pd.concat([df, encoding_1], axis=1)
encoding_2 = pd.get_dummies(df["engine-type"], dtype=int)
df = pd.concat([df, encoding_2], axis=1)

# 3. تحديد الـ Features[cite: 1]
x = df[["wheel-base","length","width",
        "curb-weight","engine-size","bore",
        "horsepower","city-mpg","highway-mpg","gas","diesel","peak-rpm","stroke",
        "4wd","fwd","rwd","alfa-romero","audi","bmw","chevrolet","dodge","honda","isuzu",
        "jaguar","mazda","mercedes-benz","mercury","mitsubishi","nissan","peugot",
        "plymouth","porsche","renault","saab","subaru","toyota","volkswagen","volvo",
        "normalized-losses","symboling",'dohc', 'l', 'ohc', 'ohcf', 'ohcv','rotor',
        'eight', 'five', 'four','six', 'three', 'twelve', 'two']]
y = df["price"]

# 4. التدريب[cite: 1]
lm = LinearRegression()
lm.fit(x, y)

# 5. الحفظ النهائي (المهم للـ API)
joblib.dump(lm, 'car_model.pkl')
joblib.dump(list(x.columns), 'model_columns.pkl')

print("Done: Model and Columns saved!")