# Ethereum Public Key to Private Key Brute Force Javascript Application

[DEMO](https://ethbruteforce.jadehamel.fr/)

This application is a demonstration of brute-forcing the private key corresponding to a given public key x-coordinate on the SECP256K1 elliptic curve. This application is for educational purposes only and should not be used for any malicious activities.

## Features

- Input fields for public key x-coordinate, minimum range, and maximum range.
- Brute force button to start the brute-forcing process.
- Stop button to stop the brute-forcing process.
- Progress bar showing the percentage of the brute force progress.
- Log displaying the start, stop, and result of the brute-forcing attempts.
- Current attempt display showing the latest private key attempt.
- Default values for min range and max range are set on page load.
- Input fields for min range and max range are disabled during brute force execution.
- Private key output field is always disabled to prevent user input.

## How It Works

1. **Elliptic Curve Operations**: The application uses basic elliptic curve operations, including point addition, point doubling, and scalar multiplication to compute the public key from a given private key.

2. **Brute Force Algorithm**: The brute force function increments the private key from the specified min range to the max range, computing the corresponding public key each time and comparing it with the input public key x-coordinate. If a match is found, the corresponding private key is displayed.

## Setup and Usage

1. Clone the repository or download the files.

2. Open the HTML file in a web browser.

3. Enter the public key x-coordinate in the input field. Ensure it is in hexadecimal format.

4. Enter the desired min range and max range for the brute force attempt.

5. Click on the "Brute Force" button to start the brute-forcing process. The input fields for min range and max range will be disabled during this process.

6. The progress bar will update to show the percentage of completion, accurate to six decimal places.

7. The log will display messages about the start and stop times of the brute force process and the total number of attempts made.

8. The current attempt will be displayed below the progress bar.

9. To stop the brute-forcing process at any time, click on the "Stop" button.

## Example

Here is an example of how the input fields might look:

- **Public Key x-coordinate**: `0x1d1c64f068cf4f5ec0c3e9e6eb0d403e8a3f7e7b8354ab8ed0d30e1a243dbb3d`
- **Min Range**: `1`
- **Max Range**: `100000000000000000000`

When you click the "Brute Force" button, the application will start attempting private keys from the min range to the max range, updating the progress and logging each step.

## Notes

- The SECP256K1 elliptic curve parameters used are:
  - **Prime (p)**: `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F`
  - **Generator Point (G)**:
    - x-coordinate: `0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798`
    - y-coordinate: `0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8`

- The progress percentage is calculated and displayed up to six decimal places for better accuracy.

- The min range and max range fields are enabled when the brute force process is stopped and disabled when the brute force process is running.

# Quantum Brute Force Elliptic Curve Key Finder

- Run the python file "QuantumBruteForce.py"

This project demonstrates how to perform elliptic curve point multiplication and a brute-force search using quantum computing principles with Qiskit. It targets a specific elliptic curve (secp256k1) commonly used in cryptographic applications.

## Requirements

- Python 3.8+
- Qiskit
- NumPy

## Disclaimer

This application is intended for educational purposes only. Unauthorized use of this software to brute force private keys from public keys without permission is illegal and unethical. The author of this application is not responsible for any misuse of the code.
