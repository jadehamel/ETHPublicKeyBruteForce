from qiskit import QuantumCircuit, execute, Aer
from qiskit.circuit.library import QFT
import numpy as np

def mod_inverse(a, p):
  if a == 0:
    return 0
  lm, hm = 1, 0
  low, high = a % p, p
  while low > 1:
    ratio = high // low
    nm, new_low = hm - lm * ratio, high - low * ratio
    lm, low, hm, high = nm, new_low, lm, low
  return lm % p

def point_addition(x1, y1, x2, y2, p):
  if x1 == x2 and y1 == y2:
    return point_doubling(x1, y1, p)
  lam = ((y2 - y1) * mod_inverse(x2 - x1, p)) % p
  x3 = (lam * lam - x1 - x2) % p
  y3 = (lam * (x1 - x3) - y1) % p
  return x3, y3

def point_doubling(x1, y1, p):
  lam = ((3 * x1 * x1) * mod_inverse(2 * y1, p)) % p
  x3 = (lam * lam - 2 * x1) % p
  y3 = (lam * (x1 - x3) - y1) % p
  return x3, y3

def scalar_multiplication(k, x, y, p):
  x_res, y_res = x, y
  k_bin = bin(k)[2:]
  for bit in k_bin[1:]:
    x_res, y_res = point_doubling(x_res, y_res, p)
    if bit == '1':
      x_res, y_res = point_addition(x_res, y_res, x, y, p)
  return x_res, y_res

def quantum_brute_force(public_key_x, g_x, g_y, p, min_range, max_range):
  quantum_registers = int(np.ceil(np.log2(max_range)))
  circuit = QuantumCircuit(quantum_registers, quantum_registers)
  circuit.h(range(quantum_registers))
  circuit.append(QFT(quantum_registers).inverse(), range(quantum_registers))
  simulator = Aer.get_backend('qasm_simulator')
  result = execute(circuit, simulator, shots=1024).result()
  counts = result.get_counts()

  progress_step = len(counts) // 100
  progress = 0

  for i, private_key_bin in enumerate(counts):
    if i % progress_step == 0:
      print(f"Progress: {progress}%")
      progress += 1

    private_key = int(private_key_bin, 2)
    if private_key < min_range or private_key > max_range:
      continue

    computed_x, _ = scalar_multiplication(private_key, g_x, g_y, p)
    if computed_x == public_key_x:
      return private_key
  return None

if __name__ == "__main__":
  public_key_x_hex = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf"
  public_key_x = int(public_key_x_hex, 16)
  min_range = 1
  max_range = (2 ** 256) - 1
  p = int("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16)
  g_x = int("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16)
  g_y = int("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16)

  private_key = quantum_brute_force(public_key_x, g_x, g_y, p, min_range, max_range)
  if private_key:
    print(f"Private key found: {hex(private_key)}")
  else:
    print("Private key not found in the given range.")
