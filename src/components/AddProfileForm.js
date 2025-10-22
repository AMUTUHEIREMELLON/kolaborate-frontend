import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../utils/config';

const AddProfileForm = ({ onProfileAdded }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    location: Yup.string().required('Location is required'),
    skills: Yup.string().required('Skills are required'),
    experienceYears: Yup.number().min(0).required('Experience years is required'),
    hourlyRate: Yup.number().min(0).required('Hourly rate is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  console.log('Form submitted with values:', values);
  try {
    const skillsArray = values.skills.split(',').map(skill => skill.trim());
    const payload = {
      ...values,
      skills: skillsArray,
      experienceYears: parseInt(values.experienceYears, 10),
      hourlyRate: parseInt(values.hourlyRate, 10),
      availableForWork: values.availableForWork || true,
    };
    const response = await axios.post(`${API_URL}/api/profiles`, payload);
    alert('Profile added successfully!');
    resetForm();
    if (onProfileAdded) onProfileAdded();
  } catch (error) {
    console.error('Add profile error:', error);
    alert(`Failed to add profile: ${error.response?.data?.error || error.message}`);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="mb-4">
      <h3>Add New Profile</h3>
      <Formik
        initialValues={{
          name: '',
          email: '',
          location: '',
          skills: '',
          experienceYears: '',
          hourlyRate: '',
          availableForWork: true,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <BootstrapForm.Group className="mb-3">
              <Field name="name" as={BootstrapForm.Control} placeholder="Name" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <Field name="email" as={BootstrapForm.Control} placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <Field name="location" as={BootstrapForm.Control} placeholder="Location" />
              <ErrorMessage name="location" component="div" className="text-danger" />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <Field name="skills" as={BootstrapForm.Control} placeholder="Skills (comma-separated)" />
              <ErrorMessage name="skills" component="div" className="text-danger" />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <Field name="experienceYears" as={BootstrapForm.Control} type="number" placeholder="Experience Years" />
              <ErrorMessage name="experienceYears" component="div" className="text-danger" />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <Field name="hourlyRate" as={BootstrapForm.Control} type="number" placeholder="Hourly Rate" />
              <ErrorMessage name="hourlyRate" component="div" className="text-danger" />
            </BootstrapForm.Group>
            <BootstrapForm.Group className="mb-3">
              <Field name="availableForWork" type="checkbox" as={BootstrapForm.Check} label="Available for Work" />
            </BootstrapForm.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Add Profile
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProfileForm;