import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_URL } from '../utils/config';

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

 useEffect(() => {
  console.log('Fetching profile with ID:', id);
  if (!id) {
    console.error('No ID provided');
    return;
  }
  axios
    .get(`${API_URL}/api/profiles/${id}`)
    .then((response) => setProfile(response.data))
    .catch((error) => console.error('Fetch error:', error));
}, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    location: Yup.string().required('Location is required'),
    skills: Yup.string().required('Skills are required'),
    experienceYears: Yup.number().min(0).required('Experience years is required'),
    hourlyRate: Yup.number().min(0).required('Hourly rate is required'),
    availableForWork: Yup.boolean(),
  });

  const handleUpdate = async (values) => {
  const updateData = { ...values, skills: values.skills.split(',').map(skill => skill.trim()), experienceYears: parseInt(values.experienceYears, 10) || 0, hourlyRate: parseInt(values.hourlyRate, 10) || 0, availableForWork: Boolean(values.availableForWork) };
  try {
    const response = await axios.put(`${API_URL}/api/profiles/${id}`, updateData, { headers: { 'Content-Type': 'application/json' } });
    console.log('Update successful, response:', response.data);
    alert('Profile updated successfully!');
    navigate('/');
  } catch (error) {
    console.error('Update failed:', error);
    alert(`Update failed: ${error.response?.data?.error || error.message}`);
  }
};

  if (!profile) return <div>Loading...</div>;

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{profile.name}</Card.Title>
        <Formik
          initialValues={{
            name: profile.name,
            email: profile.email,
            location: profile.location,
            skills: profile.skills.join(', '),
            experienceYears: profile.experienceYears,
            hourlyRate: profile.hourlyRate,
            availableForWork: profile.availableForWork,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log('Form submitted with values:', values);
            handleUpdate(values);
            setSubmitting(false); // Ensure this is called to reset submitting state
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Field name="name" as={Form.Control} placeholder="Name" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Field name="email" as={Form.Control} placeholder="Email" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Field name="location" as={Form.Control} placeholder="Location" />
                <ErrorMessage name="location" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Field name="skills" as={Form.Control} placeholder="Skills (comma-separated)" />
                <ErrorMessage name="skills" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Field name="experienceYears" as={Form.Control} type="number" placeholder="Experience Years" />
                <ErrorMessage name="experienceYears" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Field name="hourlyRate" as={Form.Control} type="number" placeholder="Hourly Rate" />
                <ErrorMessage name="hourlyRate" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Field name="availableForWork" type="checkbox" as={Form.Check} label="Available for Work" />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Update Profile
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')} className="ms-2">
                Back
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default ProfileDetails;