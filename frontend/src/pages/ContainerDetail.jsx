import { useParams } from 'react-router-dom';
import { createReservationRequest } from '../services/api';
import { useState } from 'react';

export default function ContainerDetail() {
  const { id } = useParams();

  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    start_date: '',
    end_date: '',
    wants_camera: false,
    notes: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      container: id,
      city: 'Dusseldorf',
      size: 'S',
      wants_camera: form.wants_camera,
      start_date: form.start_date,
      end_date: form.end_date,
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone,
      status: 'new',
      notes: form.notes,
    };

    await createReservationRequest(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs aqui */}
      <button type="submit">Reservar</button>
    </form>
  );
}
