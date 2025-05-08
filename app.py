
from flask import Flask, render_template, jsonify
import requests, re, os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/times')
def get_times():
    url = 'https://www.hebcal.com/hebcal?cfg=html&geonameid=295530&v=1&maj=on&ss=on&mf=on&c=on'
    html = requests.get(url).text

    def extract(label):
        match = re.search(rf"{label}</td>\s*<td[^>]*>([0-9:]+)</td>", html)
        return match.group(1) if match else "--:--"

    data = requests.get('https://www.hebcal.com/hebcal?cfg=json&geonameid=295530&v=1').json()
    items = data.get('items', [])
    return jsonify({
        "sunrise": extract("נץ החמה"),
        "sunset": extract("שקיעה"),
        "tzeit": extract("צאת הכוכבים"),
        "candle": next((i['title'].split(': ')[1] for i in items if i['category']=='candles'), "--:--"),
        "havdala": next((i['title'].split(': ')[1] for i in items if i['category']=='havdalah'), "--:--"),
        "parasha": next((i['title'] for i in items if i['category']=='parashat'), "---"),
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
