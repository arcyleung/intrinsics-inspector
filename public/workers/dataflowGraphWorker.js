onmessage = (e) => {
    console.log('Message received from worker' + e.data);
    postMessage(workerResult);
  }
  