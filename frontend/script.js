let token = '';

function toggleForm() {
  document.getElementById('auth').style.display = 
    document.getElementById('auth').style.display === 'none' ? 'block' : 'none';
  document.getElementById('register').style.display = 
    document.getElementById('register').style.display === 'none' ? 'block' : 'none';
}

async function register() {
  const username = document.getElementById('regUser').value;
  const password = document.getElementById('regPass').value;
  const res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
  toggleForm();
}

async function login() {
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById('auth').style.display = 'none';
    document.getElementById('vehicleForm').style.display = 'block';
    loadVehicles();
  } else {
    alert(data.error);
  }
}

async function submitVehicle() {
  const entry = {
    vehicleNumber: document.getElementById('vehicleNumber').value,
    fitnessDate: document.getElementById('fitnessDate').value,
    insuranceDate: document.getElementById('insuranceDate').value,
    permitDate: document.getElementById('permitDate').value,
    taxDate: document.getElementById('taxDate').value,
    mobile: document.getElementById('mobile').value,
    owner: document.getElementById('owner').value
  };
  await fetch('http://localhost:3000/api/vehicle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(entry)
  });
  loadVehicles();
}

async function loadVehicles() {
  const res = await fetch('http://localhost:3000/api/vehicles', {
    headers: { 'Authorization': token }
  });
  const data = await res.json();
  const list = document.getElementById('vehicleList');
  list.innerHTML = '';
  data.forEach(v => {
    const li = document.createElement('li');
    li.textContent = `${v.vehicleNumber} | Fitness: ${v.fitnessDate}, Insurance: ${v.insuranceDate}`;
    list.appendChild(li);
  });
}
