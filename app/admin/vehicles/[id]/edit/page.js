'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditVehiclePage() {
  const router = useRouter();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    type: '',
    category: '',
    passengerCapacity: '',
    suitcaseCapacity: ''
  });

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      const res = await fetch(`/api/vehicles`);
      const data = await res.json();
      const target = data.find(v => v.id === parseInt(id));
      if (target) {
        setVehicle(target);
        setForm({
          name: target.name,
          type: target.type,
          category: target.category || '',
          passengerCapacity: target.passengerCapacity,
          suitcaseCapacity: target.suitcaseCapacity
        });
      }
      setLoading(false);
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/vehicles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: parseInt(id),
        ...form,
        passengerCapacity: parseInt(form.passengerCapacity),
        suitcaseCapacity: parseInt(form.suitcaseCapacity)
      })
    });

    if (res.ok) {
      alert('Vehicle updated!');
      router.push('/admin/vehicles');
    } else {
      const error = await res.json();
      alert(`Error: ${error.error || 'Unknown error'}`);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Vehicle Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="type"
          placeholder="Type (e.g., Sedan, Van)"
          value={form.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="category"
          placeholder="Category (optional)"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="passengerCapacity"
          type="number"
          placeholder="Passenger Capacity"
          value={form.passengerCapacity}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="suitcaseCapacity"
          type="number"
          placeholder="Suitcase Capacity"
          value={form.suitcaseCapacity}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Vehicle
        </button>
      </form>
    </div>
  );
}
