class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, _outputs, _parameters) {
    const input = inputs[0];
    
    // Check if we have input data
    if (!input || !input[0]) {
      return true;
    }

    const channelData = input[0];
    
    // Check if the buffer contains actual audio data (not all zeros)
    let isSilent = true;
    for (let i = 0; i < channelData.length; i++) {
      if (channelData[i] !== 0) {
        isSilent = false;
        break;
      }
    }

    // Only post message if there's actual audio data
    if (!isSilent) {
      // Send a copy of the buffer to the main thread
      this.port.postMessage(new Float32Array(channelData));
    }

    // Return true to keep the processor alive
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
