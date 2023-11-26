document.addEventListener("DOMContentLoaded", function () {
  const countdownDisplay = document.getElementById("countdownDisplay");
  const countupDisplay = document.getElementById("countupDisplay");
  const minutesInput = document.getElementById("minutesInput");
  const secondsInput = document.getElementById("secondsInput");
  const startButton = document.getElementById("startButton");
  const pauseButton = document.getElementById("pauseButton");

  let countdownInterval;
  let countupInterval;
  let remainingTime = 0;
  let elapsedSeconds = 0;
  let isCountingDown = false;
  let isCountingUp = false;
  let isPaused = false;
  let hasFinished = false;

  // Added: Processing when the minutes input field is changed
  minutesInput.addEventListener("input", function () {
    pauseButton.disabled = isCountingDown || isCountingUp;
  });

  // Added: Processing when the seconds input field is changed
  secondsInput.addEventListener("input", function () {
    pauseButton.disabled = isCountingDown || isCountingUp;
  });

  // Fixed: Processing when pressing the start button and pause button
  startButton.addEventListener("click", function () {
    const minutes = parseInt(minutesInput.value);
    const seconds = parseInt(secondsInput.value);
    const timeInSeconds = minutes * 60 + seconds;

    if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
      if (isCountingDown || isCountingUp) {
        clearInterval(countdownInterval);
        clearInterval(countupInterval);
        countupDisplay.textContent = "";
      }
      hasFinished = false;
      remainingTime = timeInSeconds;
      startCountdown(remainingTime);
    }
  });

  pauseButton.addEventListener("click", function () {
    if (isCountingDown) {
      if (!isPaused) {
        clearInterval(countdownInterval);
        isPaused = true;
        pauseButton.textContent = "Resume";
      } else {
        startCountdown(remainingTime);
        isPaused = false;
        pauseButton.textContent = "Pause";
      }
    }
  });

  function startCountdown() {
    if (isCountingDown) {
      clearInterval(countdownInterval);
    }
    if (isPaused) {
      isPaused = false;
      pauseButton.textContent = "Pause";
    }
    countupDisplay.textContent = "";
    countdownInterval = setInterval(function () {
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.textContent = "Time's up!";
        isCountingDown = false;
        pauseButton.disabled = true;
        hasFinished = true;
        startCountup();
      } else {
        updateCountdownDisplay(remainingTime);

        // Set background color based on remaining time
        document.querySelector(".area").style.backgroundColor = "#4e54c8";
        document.body.style.backgroundColor = "#4e54c8";

        const minutes = parseInt(minutesInput.value);
        const seconds = parseInt(secondsInput.value);

        if (remainingTime <= (minutes * 60 + seconds) / 2) {
          document.querySelector(".area").style.backgroundColor = "#c8c04e";
          document.body.style.backgroundColor = "#c8c04e";
        }

        if (remainingTime <= 10) {
          document.querySelector(".area").style.backgroundColor = "#c84e4e";
          document.body.style.backgroundColor = "#c84e4e";
        }

        remainingTime--;
      }
    }, 1000);
    isCountingDown = true;
    pauseButton.disabled = false;
  }

  function startCountup() {
    countupInterval = setInterval(function () {
      updateCountupDisplay(elapsedSeconds);
      elapsedSeconds++;
    }, 1000);
    isCountingUp = true;
    startButton.disabled = false;
  }

  function updateCountdownDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    countdownDisplay.textContent = `${minutes}:${String(seconds).padStart(
      2,
      "0"
    )}`;
    console.log(remainingTime);
  }

  function updateCountupDisplay(elapsedSeconds) {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    countupDisplay.textContent = `It's been ${minutes}:${String(
      seconds
    ).padStart(2, "0")} since the drink was frozen`;
  }
});
