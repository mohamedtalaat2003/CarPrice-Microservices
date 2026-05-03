# # %%
# import pandas as pd
# path =r"d:\Data Science by Python (Coursera)\Data Analysis with python\automobile.csv"
# df = pd.read_csv(path, header=0)

# # %%
# df.head()

# # %%
# df.isnull().sum()

# # %%
# df.dtypes

# # %%
# encoding_1 = pd.get_dummies(df["num-of-cylinders"], dtype=int)
# df = pd.concat([df, encoding_1], axis=1)

# # %%
# encoding_2 = pd.get_dummies(df["engine-type"], dtype=int)
# df = pd.concat([df, encoding_2], axis=1)

# # %%
# df.head()

# # %% [markdown]
# # ### Create A Model

# # %%
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import PolynomialFeatures, StandardScaler
# from sklearn.pipeline import Pipeline
# from sklearn.model_selection import train_test_split, cross_val_score, cross_val_predict
# from sklearn.metrics import r2_score, mean_squared_error

# # %%
# df.columns

# # %%
# x = df[["wheel-base","length","width",
#         "curb-weight","engine-size","bore",
#         "horsepower","city-mpg","highway-mpg","gas","diesel","peak-rpm","stroke",
#         "4wd","fwd","rwd","alfa-romero","audi","bmw","chevrolet","dodge","honda","isuzu",
#         "jaguar","mazda","mercedes-benz","mercury","mitsubishi","nissan","peugot",
#         "plymouth","porsche","renault","saab","subaru","toyota","volkswagen","volvo",
#         "normalized-losses","symboling",'dohc', 'l', 'ohc', 'ohcf', 'ohcv','rotor',
#         'eight', 'five', 'four','six', 'three', 'twelve', 'two']]
# y = df["price"]

# # %% [markdown]
# # ### Linear Regression Model

# # %%
# lm = LinearRegression()

# x_train2, x_test2, y_train2, y_test2 = train_test_split(x,y, test_size=0.3, random_state=0)

# lm.fit(x_train2, y_train2)

# y_hat_2 = lm.predict(x_test2)

# # %%
# r2_2 = r2_score(y_test2, y_hat_2)
# mse_2 = mean_squared_error(y_test2, y_hat_2)
# print("R-Squared is equal =", r2_2)
# print("Mean Squared Error is equal =", mse_2)

# # %%
# import matplotlib.pyplot as plt
# import seaborn as sns

# # %%
# sns.kdeplot(y_test2, color="b", label="Actual values", fill=True)
# sns.kdeplot(y_hat_2, color="r", label="Prediction values", fill=True)
# plt.title("Comparison between the distribution of actual and prediction values")
# plt.legend()
# plt.show()



# import grpc
# from concurrent import futures
# import car_predictor_pb2
# import car_predictor_pb2_grpc
# import pandas as pd
# from sklearn.linear_model import LinearRegression

# # --- جزء الـ ML من ملفك الأصلي ---
# # يفضل عمل Train للموديل وحفظه، لكن للتبسيط هنفترض الموديل 'lm' جاهز هنا
# # lm = LinearRegression().fit(x_train, y_train) 

# class CarPriceServicer(car_predictor_pb2_grpc.CarPriceServiceServicer):
#     def PredictPrice(self, request, context):
#         # 1. استلام البيانات من طلب الـ .NET
#         data = {
# # Dimensions
#     "wheel-base": [request.wheel_base],
#     "length": [request.length],
#     "width": [request.width],
#     "curb-weight": [request.curb_weight],

#     # Engine
#     "engine-size": [request.engine_size],
#     "bore": [request.bore],
#     "stroke": [request.stroke],
#     "horsepower": [request.horsepower],
#     "peak-rpm": [request.peak_rpm],

#     # Fuel consumption
#     "city-mpg": [request.city_mpg],
#     "highway-mpg": [request.highway_mpg],

#     # Fuel type
#     "gas": [request.gas],
#     "diesel": [request.diesel],

#     # Drive type
#     "4wd": [request.four_wd],
#     "fwd": [request.fwd],
#     "rwd": [request.rwd],

#     # Brands
#     "alfa-romero": [request.alfa_romero],
#     "audi": [request.audi],
#     "bmw": [request.bmw],
#     "chevrolet": [request.chevrolet],
#     "dodge": [request.dodge],
#     "honda": [request.honda],
#     "isuzu": [request.isuzu],
#     "jaguar": [request.jaguar],
#     "mazda": [request.mazda],
#     "mercedes-benz": [request.mercedes_benz],
#     "mercury": [request.mercury],
#     "mitsubishi": [request.mitsubishi],
#     "nissan": [request.nissan],
#     "peugot": [request.peugot],
#     "plymouth": [request.plymouth],
#     "porsche": [request.porsche],
#     "renault": [request.renault],
#     "saab": [request.saab],
#     "subaru": [request.subaru],
#     "toyota": [request.toyota],
#     "volkswagen": [request.volkswagen],
#     "volvo": [request.volvo],

#     # Other numeric
#     "normalized-losses": [request.normalized_losses],
#     "symboling": [request.symboling],

#     # Engine type
#     "dohc": [request.dohc],
#     "l": [request.l],
#     "ohc": [request.ohc],
#     "ohcf": [request.ohcf],
#     "ohcv": [request.ohcv],
#     "rotor": [request.rotor],

#     # Cylinders
#     "two": [request.two],
#     "three": [request.three],
#     "four": [request.four],
#     "five": [request.five],
#     "six": [request.six],
#     "eight": [request.eight],
#     "twelve": [request.twelve]
#         }
        
#         # 2. تحويل البيانات لـ DataFrame عشان الموديل يفهمها[cite: 1]
#         features_df = pd.DataFrame(data)
        
#         # 3. التوقع باستخدام الموديل اللي دربناه في ملفك[cite: 1]
#         # ملاحظة: لازم الترتيب والأعمدة تكون نفس اللي اتدرب عليها الموديل
#         try:
#             prediction = lm.predict(features_df)[0]
#             return car_predictor_pb2.PriceResponse(
#                 predicted_price=prediction,
#                 message="Success"
#             )
#         except Exception as e:
#             return car_predictor_pb2.PriceResponse(
#                 predicted_price=0,
#                 message=f"Error: {str(e)}"
#             )

# def serve():
#     server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
#     car_predictor_pb2_grpc.add_CarPriceServiceServicer_to_server(CarPriceServicer(), server)
#     server.add_insecure_port('[::]:50051') # البورت اللي .NET هيكلمه عليه
#     print("Python gRPC Server started on port 50051...")
#     server.start()
#     server.wait_for_termination()

# if __name__ == '__main__':
#     serve()
#     import joblib

# # حفظ الموديل المدرب في ملف اسمه car_model.pkl
# joblib.dump(lm, 'car_model.pkl')

# # حفظ قائمة الأعمدة بالترتيب الصحيح (مهم جداً للـ API)
# model_columns = list(x.columns)
# joblib.dump(model_columns, 'model_columns.pkl')

# print("Model and Columns saved successfully!")


# import grpc
# import joblib
# import pandas as pd
# import car_predictor_pb2
# import car_predictor_pb2_grpc
# from concurrent import futures

# # 1. تحميل الموديل والأعمدة فور تشغيل السيرفر
# model = joblib.load('car_model.pkl')
# model_columns = joblib.load('model_columns.pkl')

# class CarPriceServicer(car_predictor_pb2_grpc.CarPriceServiceServicer):
#     def PredictPrice(self, request, context):
#         try:
#             # 2. استلام البيانات من .NET وتحويلها لـ Dictionary
#             input_data = {
#                # Dimensions
#     "wheel-base": [request.wheel_base],
#     "length": [request.length],
#     "width": [request.width],
#     "curb-weight": [request.curb_weight],

#     # Engine
#     "engine-size": [request.engine_size],
#     "bore": [request.bore],
#     "stroke": [request.stroke],
#     "horsepower": [request.horsepower],
#     "peak-rpm": [request.peak_rpm],

#     # Fuel consumption
#     "city-mpg": [request.city_mpg],
#     "highway-mpg": [request.highway_mpg],

#     # Fuel type
#     "gas": [request.gas],
#     "diesel": [request.diesel],

#     # Drive type
#     "4wd": [request.four_wd],
#     "fwd": [request.fwd],
#     "rwd": [request.rwd],

#     # Brands
#     "alfa-romero": [request.alfa_romero],
#     "audi": [request.audi],
#     "bmw": [request.bmw],
#     "chevrolet": [request.chevrolet],
#     "dodge": [request.dodge],
#     "honda": [request.honda],
#     "isuzu": [request.isuzu],
#     "jaguar": [request.jaguar],
#     "mazda": [request.mazda],
#     "mercedes-benz": [request.mercedes_benz],
#     "mercury": [request.mercury],
#     "mitsubishi": [request.mitsubishi],
#     "nissan": [request.nissan],
#     "peugot": [request.peugot],
#     "plymouth": [request.plymouth],
#     "porsche": [request.porsche],
#     "renault": [request.renault],
#     "saab": [request.saab],
#     "subaru": [request.subaru],
#     "toyota": [request.toyota],
#     "volkswagen": [request.volkswagen],
#     "volvo": [request.volvo],

#     # Other numeric
#     "normalized-losses": [request.normalized_losses],
#     "symboling": [request.symboling],

#     # Engine type
#     "dohc": [request.dohc],
#     "l": [request.l],
#     "ohc": [request.ohc],
#     "ohcf": [request.ohcf],
#     "ohcv": [request.ohcv],
#     "rotor": [request.rotor],

#     # Cylinders
#     "two": [request.two],
#     "three": [request.three],
#     "four": [request.four],
#     "five": [request.five],
#     "six": [request.six],
#     "eight": [request.eight],
#     "twelve": [request.twelve]
#             }

#             # 3. تحويل لـ DataFrame
#             df = pd.DataFrame(input_data)

#             # 4. إعادة ترتيب الأعمدة لتطابق ما تدرب عليه الموديل
#             # دي الخطوة اللي بتضمن إن الموديل ميتلخبطش
#             df = df.reindex(columns=model_columns, fill_value=0)

#             # 5. التوقع
#             prediction = model.predict(df)[0]

#             return car_predictor_pb2.PriceResponse(
#                 predicted_price=float(prediction),
#                 message="Prediction successful"
#             )
#         except Exception as e:
#             return car_predictor_pb2.PriceResponse(
#                 predicted_price=0,
#                 message=f"Python Error: {str(e)}"
#             )

# # ... كود الـ serve() يظل كما هو