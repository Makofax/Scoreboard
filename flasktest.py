import sys
from flask import Flask, render_template
from random import randrange

app = Flask(__name__)



@app.route("/")
@app.route("/Scoreboard", methods=['GET', 'POST'])
def GUI():
    return render_template('Scoreboard.html', title='Scoreboard')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True, threaded=True)
