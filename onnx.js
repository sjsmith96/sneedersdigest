import ort from 'onnxruntime-web';




const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.textAlign = "center";
ctx.font = "20px InriaSans";
ctx.lineWidth = 15;
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

ctx.fillText("Loading model...", canvas.width / 2, canvas.height / 2);

const session = await loadModel();
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillText("Draw a number here!", canvas.width / 2, canvas.height / 2);

let isShowingStartText = true;

// Load the ONNX model
async function loadModel() {
  try
  {
    const session = await ort.InferenceSession.create('/onnx_model.onnx');
    return session;
  }
  catch(err)
  {
    ctx.fillText(`Error: ${err.message}`, canvas.width / 2, canvas.height / 2);
  }
}
/**
 * Retrieve the array key corresponding to the largest element in the array.
 *
 * @param {Array.<number>} array Input array
 * @return {number} Index of array element with largest value
 */
function argMax(array) {
  return array.reduce((maxIndex, currentValue, currentIndex, arr) => 
    currentValue > arr[maxIndex] ? currentIndex : maxIndex, 0);
}

async function guess() {
  const image = ctx.getImageData(0, 0, 280, 280);
  const sneeds = {
    '0': new ort.Tensor('float32', new Float32Array(image.data))
  };

  const output = await session.run(sneeds);
  const outputTensor = output["30"];
  const predictions = outputTensor.data;
  const maxPrediction = argMax(predictions);
  for (let i = 0; i < predictions.length; i++) {

    
    const element = document.getElementById(`fill-${i}`);    
    const digit = document.getElementById(`digit-${i}`);
    if(i == maxPrediction)
    {
      digit.className = 'bar-card__digit--predicted';
      element.className = 'bar-card__bar-fill--predicted';
    }
    else
    {
      digit.className = 'bar-card__digit';
      element.className = 'bar-card__bar-fill';
    }

    element.style.height = `${predictions[i] * 100}%`;
  }
}

let drawing = false;
let started = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => {
    drawing = false
    started = false;
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', () => drawing = true);
canvas.addEventListener('touchend', () => {
    drawing = false
    started = false;
});
canvas.addEventListener('touchmove', draw);

function draw(event) {
    if (!drawing) return;

    if(!started)
    {
        started = true;
        if(isShowingStartText)
        {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          isShowingStartText = false;
        }

        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }
    else
    {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    guess();
}

// Clear canvas
document.getElementById('clear-btn').addEventListener('click', () => {
  for (let i = 0; i < 10; i++) {
    const element = document.getElementById(`fill-${i}`);
    const digit = document.getElementById(`digit-${i}`);
    element.style.height = "0";
    digit.className = 'bar-card__digit';
  }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    started = false;
    isShowingStartText = false;
});
