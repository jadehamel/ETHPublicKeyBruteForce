let isRunning = false;
let startTime, attemptCount;

function modInverse(a, p) {
  if (a === 0n) return 0n;
  let lm = 1n, hm = 0n, low = a % p, high = p;
  while (low > 1n) {
    const ratio = high / low;
    const nm = hm - lm * ratio, newLow = high - low * ratio;
    lm = nm, low = newLow, hm = lm, high = low;
  }
  return lm % p;
}

function pointAddition(x1, y1, x2, y2, p) {
  if (x1 === x2 && y1 === y2) return pointDoubling(x1, y1, p);
  const lam = ((y2 - y1) * modInverse(x2 - x1, p)) % p;
  const x3 = (lam * lam - x1 - x2) % p;
  const y3 = (lam * (x1 - x3) - y1) % p;
  return [x3, y3];
}

function pointDoubling(x1, y1, p) {
  const lam = ((3n * x1 * x1) * modInverse(2n * y1, p)) % p;
  const x3 = (lam * lam - 2n * x1) % p;
  const y3 = (lam * (x1 - x3) - y1) % p;
  return [x3, y3];
}

function scalarMultiplication(k, x, y, p) {
  let xRes = x, yRes = y;
  const kBin = k.toString(2).slice(1);
  for (const bit of kBin) {
    [xRes, yRes] = pointDoubling(xRes, yRes, p);
    if (bit === '1') [xRes, yRes] = pointAddition(xRes, yRes, x, y, p);
  }
  return [xRes, yRes];
}

function updateProgress(privateKey, maxRange) {
  const progressBar = document.getElementById("progressBar");
  const progressPercentage = document.getElementById("progressPercentage");
  const percentage = (Number(privateKey) / Number(maxRange)) * 100;
  progressBar.style.width = percentage + "%";
  progressPercentage.textContent = percentage.toFixed(40) + "%";
}

function logAttempt(message) {
  const log = document.getElementById("log");
  const entry = document.createElement("div");
  entry.textContent = message;
  log.appendChild(entry);
}

function bruteForce(privateKey, maxRange, publicKeyX, G_x, G_y, p) {
  if (!isRunning) return;

  setTimeout(() => {
    attemptCount++;
    const [publicKeyXComputed, publicKeyYComputed] = scalarMultiplication(privateKey, G_x, G_y, p);

    if (publicKeyXComputed === publicKeyX) {
      const endTime = new Date();
      document.getElementById("privateKeyOutput").value = privateKey.toString(16);
      logAttempt("Brute force succeeded at: " + endTime);
      logAttempt("Total attempts: " + attemptCount);
      isRunning = false;
      toggleInputFields(false);
      return;
    }

    document.getElementById("currentAttempt").innerHTML = "Current Attempt: " + privateKey.toString(16);
    updateProgress(privateKey, maxRange);

    if (privateKey < maxRange) {
      bruteForce(privateKey + 1n, maxRange, publicKeyX, G_x, G_y, p);
    } else {
      document.getElementById("privateKeyOutput").value = "Private key not found in the given range.";
      isRunning = false;
      toggleInputFields(false);
    }
  }, 0);
}

function startBruteForce() {
  if (isRunning) return;
  isRunning = true;
  startTime = new Date();
  attemptCount = 0;
  logAttempt("Brute force started at: " + startTime);

  let publicKeyXHex = document.getElementById("publicKeyInput").value;
  if (publicKeyXHex.startsWith("0x")) {
    publicKeyXHex = publicKeyXHex.slice(2);
  }
  const publicKeyX = BigInt("0x" + publicKeyXHex);

  const minRange = BigInt(document.getElementById("minRangeInput").value);
  const maxRange = BigInt(document.getElementById("maxRangeInput").value);

  const p = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
  const G_x = BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798");
  const G_y = BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");

  let privateKey = minRange;

  document.getElementById("privateKeyOutput").value = "";
  updateProgress(privateKey, maxRange);
  toggleInputFields(true);
  bruteForce(privateKey, maxRange, publicKeyX, G_x, G_y, p);
}

function stopBruteForce() {
  isRunning = false;
  logAttempt("Brute force stopped.");
  toggleInputFields(false);
}

function toggleInputFields(disabled) {
  document.getElementById("minRangeInput").disabled = disabled;
  document.getElementById("maxRangeInput").disabled = disabled;
  document.getElementById("publicKeyInput").disabled = disabled;
  document.getElementById("bruteForceButton").disabled = disabled;
}

window.onload = function() {
  document.getElementById("publicKeyInput").value = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf";
  document.getElementById("minRangeInput").value = "999999999999999999";
  document.getElementById("maxRangeInput").value = "10000000000000000000";
  document.getElementById("privateKeyOutput").disabled = true;
};
