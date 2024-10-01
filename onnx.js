//import ort from 'onnxruntime-web';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.textAlign = "center";
ctx.font = "20px InriaSans";
ctx.lineWidth = 15;
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

ctx.fillText("Loading model...", canvas.width / 2, canvas.height / 2);

const session = new onnx.InferenceSession();
const loadingModelPromise = session.loadModel("/onnx_model.onnx");

let isShowingStartText = true;

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
  const input = new onnx.Tensor(new Float32Array(image.data), "float32");

  const outputMap = await session.run([input]);
  const outputTensor = outputMap.values().next().value;
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

// Function to get touch position relative to the canvas
function getTouchPos(canvas, touchEvent) {
  const rect = canvas.getBoundingClientRect();
  const touch = touchEvent.touches[0];
  return {
    x: touch.clientX - rect.x,
    y: touch.clientY - rect.y
  };
}

loadingModelPromise.then(() => {  
  canvas.addEventListener('mousedown', () => drawing = true);
  canvas.addEventListener('mouseup', () => {
      drawing = false
      started = false;
  });
  canvas.addEventListener('mousemove', draw);

  // Set up touch events for mobile, etc
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    var mouseEvent = new MouseEvent("mousedown");
    canvas.dispatchEvent(mouseEvent);
  }, false);

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    var mouseEvent = new MouseEvent("mouseup");
    canvas.dispatchEvent(mouseEvent);
  }, false);

  canvas.addEventListener("touchmove", (e) => {
    try
    {
      e.preventDefault();
      const touch = e.touches[0];
      const touchPos = getTouchPos(canvas, e);
      var mouseEvent = new MouseEvent("mousemove", {
        screenX: touch.screenX,
        screenY: touch.screenY,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    }
    catch(err)
    {
      alert(err.message);
    }
  }, false);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText("Draw a number here!", canvas.width / 2, canvas.height / 2);
});

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

