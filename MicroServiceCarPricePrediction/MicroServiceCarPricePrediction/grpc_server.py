import grpc
import joblib
import pandas as pd
import car_predictor_pb2
import car_predictor_pb2_grpc
import sys
import logging
from concurrent import futures


# إعداد اللوجر ليظهر في الـ Terminal الخاص بالدوكر
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)] # توجيه اللوج للـ stdout ليراه الدوكر
)
logger = logging.getLogger("ML-Service")

# 1. تحميل الموديل والأعمدة (مرة واحدة فقط)
try:
    model = joblib.load('car_model.pkl')
    model_columns = joblib.load('model_columns.pkl')
    print("Model loaded successfully.")
except:
    print("Error: Model files not found. Run training script first.")

class CarPriceServicer(car_predictor_pb2_grpc.CarPriceServiceServicer):
    logger.info(f"Received prediction request for car brand flags.")
    def PredictPrice(self, request, context):
        try:
            # 2. استلام البيانات وتحويلها لـ Dictionary[cite: 1]
            input_data = {
# Dimensions
    "wheel-base": [request.wheel_base],
    "length": [request.length],
    "width": [request.width],
    "curb-weight": [request.curb_weight],

    # Engine
    "engine-size": [request.engine_size],
    "bore": [request.bore],
    "stroke": [request.stroke],
    "horsepower": [request.horsepower],
    "peak-rpm": [request.peak_rpm],

    # Fuel consumption
    "city-mpg": [request.city_mpg],
    "highway-mpg": [request.highway_mpg],

    # Fuel type
    "gas": [request.gas],
    "diesel": [request.diesel],

    # Drive type
    "4wd": [request.four_wd],
    "fwd": [request.fwd],
    "rwd": [request.rwd],

    # Brands
    "alfa-romero": [request.alfa_romero],
    "audi": [request.audi],
    "bmw": [request.bmw],
    "chevrolet": [request.chevrolet],
    "dodge": [request.dodge],
    "honda": [request.honda],
    "isuzu": [request.isuzu],
    "jaguar": [request.jaguar],
    "mazda": [request.mazda],
    "mercedes-benz": [request.mercedes_benz],
    "mercury": [request.mercury],
    "mitsubishi": [request.mitsubishi],
    "nissan": [request.nissan],
    "peugot": [request.peugot],
    "plymouth": [request.plymouth],
    "porsche": [request.porsche],
    "renault": [request.renault],
    "saab": [request.saab],
    "subaru": [request.subaru],
    "toyota": [request.toyota],
    "volkswagen": [request.volkswagen],
    "volvo": [request.volvo],

    # Other numeric
    "normalized-losses": [request.normalized_losses],
    "symboling": [request.symboling],

    # Engine type
    "dohc": [request.dohc],
    "l": [request.l],
    "ohc": [request.ohc],
    "ohcf": [request.ohcf],
    "ohcv": [request.ohcv],
    "rotor": [request.rotor],

    # Cylinders
    "two": [request.two],
    "three": [request.three],
    "four": [request.four],
    "five": [request.five],
    "six": [request.six],
    "eight": [request.eight],
    "twelve": [request.twelve]
            }

            # 3. تحويل لـ DataFrame وإعادة الترتيب[cite: 1]
            df = pd.DataFrame(input_data)
            df = df.reindex(columns=model_columns, fill_value=0)

            # 4. التوقع
            prediction = model.predict(df)[0]
            logger.info("Prediction successful.")
            return car_predictor_pb2.PriceResponse(
                predicted_price=float(prediction),
                message="Prediction successful"
            )
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            return car_predictor_pb2.PriceResponse(
                predicted_price=0,
                message=f"Python Error: {str(e)}"
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    car_predictor_pb2_grpc.add_CarPriceServiceServicer_to_server(CarPriceServicer(), server)
    server.add_insecure_port('[::]:50051')
    print("Python gRPC Server started on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()