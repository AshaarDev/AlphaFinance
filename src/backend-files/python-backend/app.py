from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
import yfinance as yf

app = Flask(__name__)
CORS(app)  

# Function to normalize column names
def normalize_column_names(df):
    column_mapping = {
        "date": "Date",
        "open": "Open",
        "high": "High",
        "low": "Low",
        "close": "Close",
        "adj close": "Adj Close",
        "adjusted close": "Adj Close",
        "adjClose": "Adj Close",
        "volume": "Volume"
    }
    print("Original column names:", df.columns.tolist())

    # Normalize column names by mapping to consistent keys
    df.columns = [column_mapping.get(col.lower().strip(), col) for col in df.columns]
    print("Normalized column names:", df.columns.tolist())
    return df

    column_mapping = {
        "date": "Date",
        "open": "Open",
        "high": "High",
        "low": "Low",
        "close": "Close",
        "adj close": "Adj Close",
        "volume": "Volume"
    }
    print("Original column names:", df.columns.tolist())
    df.columns = [column_mapping.get(col.lower(), col) for col in df.columns]
    print("Normalized column names:", df.columns.tolist())
    return df

# Mock function to simulate S&P 500 data
# def fetch_sp500_data_mock():
#     data = {
#         "Date": ["2023-09-01", "2023-09-02", "2023-09-03"],
#         "Adj Close": [100, 102, 104],
#     }
#     print("Mock S&P 500 data created.")
#     return pd.DataFrame(data).set_index("Date")

# Function to fetch real S&P 500 data
def fetch_sp500_data(start_date, end_date):
    try:
        print(f"Fetching S&P 500 data from {start_date} to {end_date}...")
        sp500_data = yf.download("^GSPC", start=start_date, end=end_date)
        print("S&P 500 Data Fetched Successfully:")
        print(sp500_data.head())

        sp500_data = sp500_data[['Adj Close']].dropna()
        return sp500_data
    except Exception as e:
        print(f"Error fetching S&P 500 data: {e}")
        return None

def perform_stock_prediction(stock_data):
    try:
        print("Stock Data for Prediction:")
        print(stock_data.head())

        stock_data['Date'] = pd.to_datetime(stock_data['Date'])
        stock_data.set_index('Date', inplace=True)
        print("Stock Data after setting Date as index:")
        print(stock_data.head())

        if 'Adj Close' not in stock_data:
            print("Error: Missing 'Adj Close' column.")
            raise ValueError("Missing 'Adj Close' column in the data.")

        stock_data['Date_ordinal'] = stock_data.index.map(pd.Timestamp.toordinal)
        print("Date_ordinal added to Stock Data:")
        print(stock_data[['Date_ordinal', 'Adj Close']].head())

        X = stock_data[['Date_ordinal']]
        y = stock_data['Adj Close']

        model = LinearRegression()
        model.fit(X, y)
        print("Linear Regression model trained.")

        future_date = stock_data.index[-1] + pd.Timedelta(days=1)
        future_ordinal = future_date.toordinal()
        predicted_price = model.predict([[future_ordinal]])[0]
        print(f"Predicted Price for {future_date}: {predicted_price}")

        return {"predicted_price": round(predicted_price, 2)}

    except Exception as e:
        print("Error in stock prediction:", str(e))
        raise RuntimeError(f"Prediction Error: {e}")

def perform_analysis(stock_data):
    try:
        print("Performing analysis on stock data:")
        print(stock_data.head())

        result = perform_stock_prediction(stock_data)

        start_date = stock_data.index.min().strftime('%Y-%m-%d')
        end_date = stock_data.index.max().strftime('%Y-%m-%d')
        sp500_data = fetch_sp500_data(start_date, end_date)

        if sp500_data is not None and not sp500_data.empty:
            print("Real S&P 500 Data:")
            print(sp500_data.head())

            merged_data = stock_data[['Adj Close']].join(sp500_data, how="inner", lsuffix='_stock', rsuffix='_sp500')
            merged_data['Stock_Return'] = merged_data['Adj Close_stock'].pct_change()
            merged_data['SP500_Return'] = merged_data['Adj Close_sp500'].pct_change()

            correlation = merged_data['Stock_Return'].corr(merged_data['SP500_Return'])
            print(f"Calculated correlation with S&P 500: {correlation}")
            result['correlation_with_sp500'] = round(correlation, 4)
        else:
            print("Failed to fetch S&P 500 data. Setting correlation to None.")
            result['correlation_with_sp500'] = None

        historical_data = stock_data.reset_index()[['Date', 'Adj Close']].to_dict(orient="records")
        result['historical_data'] = historical_data

        return result

    except Exception as e:
        print("Error in perform_analysis:", str(e))
        return {"error": str(e)}

    except Exception as e:
        print("Error in perform_analysis:", str(e))
        return {"error": str(e)}


@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        print("Received request for /api/analyze.")
        json_data = request.json.get("data", [])
        if not json_data:
            print("Error: No data provided")
            return jsonify({"error": "No data provided"}), 400

        print("Raw JSON data received:", json_data[:5]) 

        df = pd.DataFrame(json_data)
        if df.empty:
            print("Error: Data is empty")
            return jsonify({"error": "Data is empty"}), 400

        print("Converted JSON to DataFrame:")
        print(df.head())

        df = normalize_column_names(df)
        
        print("Normalized DataFrame:")
        print(df.head())

        result = perform_analysis(df)
        print("Analysis Result:", result)

        response = {"message": "Analysis complete", "result": result}
        print("Response to be sent:", response)
        return jsonify(response), 200

    except Exception as e:
        print("Error in analyze route:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080, threaded=False)
