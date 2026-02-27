// 1. Settings and instances
const API_URL = '/api';

// 2. Services (calls to the API)
const DoctorService = {
    // Corregido: res => res.json() para que la promesa resuelva el cuerpo
    getAll: (specialty = '') => 
        fetch(`${API_URL}/doctors?specialty=${specialty}`).then(res => res.json()),
    
    // Agregamos el servicio de migración
    migrate: (formData) => 
        fetch(`${API_URL}/migrate`, { method: 'POST', body: formData }).then(res => res.json())
};

const PatientService = {
    getHistory: (email) => 
        fetch(`${API_URL}/patients/${email}/history`).then(res => res.json())
};

// 3. UI components (RENDERING)
// Wrapped loose logic into renderDoctorTable function to fix reference errors
function renderDoctorTable(doctors) {
    const tbody = document.getElementById('doctor-tbody');
    if (!tbody) return;

    // 2. Mapeo de datos (Ajustado a los campos de MariaDB)
    tbody.innerHTML = doctors.map(doc => `
        <tr class="border-b hover:bg-slate-50 transition">
            <td class="py-4 px-2 font-mono text-blue-600 text-sm">
                ${doc.id || 'N/A'}
            </td>
            <td class="py-4 px-2 font-medium">
                ${doc.name || 'Unknown'}
            </td>
            <td class="py-4 px-2 text-sm">
                <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                    ${doc.specialty || 'General'}
                </span>
            </td>
        </tr>
    `).join('');
}

function renderHistoryView(data) {
    const display = document.querySelector('#json-display');
    if (display) {
        display.innerText = JSON.stringify(data, null, 2);
    }
}

// 4. Event controllers
document.addEventListener('DOMContentLoaded', async () => {
    // Initial Load
    const initialDoctors = await DoctorService.getAll();
    renderDoctorTable(initialDoctors);

    // Search Patient History
    const btnSearch = document.querySelector('#btn-search');
    const emailInput = document.querySelector('#email-search');

    btnSearch?.addEventListener('click', async () => {
        // Use trim to avoid empty spaces in the email search
        const email = emailInput.value.trim();
        if (!email) return alert("Please enter an email");
        
        renderHistoryView({ status: "Searching..." });
        const data = await PatientService.getHistory(email);
        renderHistoryView(data);
    });

    // Filter Doctors
    document.querySelector('#specialty-filter')?.addEventListener('change', async (e) => {
        const filtered = await DoctorService.getAll(e.target.value);
        renderDoctorTable(filtered);
    });

    // Handle Migration Form
    document.querySelector('#upload-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const result = await DoctorService.migrate(new FormData(e.target));
        alert(result.message || result.error);
        if (result.message) location.reload();
    });
});