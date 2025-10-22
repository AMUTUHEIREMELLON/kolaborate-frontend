import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddProfileForm from '../components/AddProfileForm';

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [page, searchTerm]);

  const fetchProfiles = () => {
    const url = searchTerm
      ? `http://localhost:5000/api/profiles/search?skills=${searchTerm}`
      : `http://localhost:5000/api/profiles?page=${page}&limit=${limit}`;
    axios.get(url)
      .then(response => {
        setProfiles(response.data.profiles || response.data);
        setTotal(response.data.total || response.data.length);
      })
      .catch(error => console.error('Error fetching profiles:', error));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(total / limit)) setPage(newPage);
  };

  return (
    <div>
      <Form className="mb-4">
        <Form.Group>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skills (e.g., React)"
          />
          <Button variant="primary" onClick={fetchProfiles} className="mt-2">
            Search
          </Button>
        </Form.Group>
      </Form>
      <AddProfileForm onProfileAdded={fetchProfiles} />
      <Row>
        {profiles.map(profile => (
          <Col key={profile._id} xs={12} sm={6} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{profile.name}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {profile.location}<br />
                  <strong>Rate:</strong> ${profile.hourlyRate}/hr<br />
                  <strong>Skills:</strong> {profile.skills.join(', ')}
                </Card.Text>
                <Button
                  variant="info"
                  onClick={() => navigate(`/profile/${profile._id}`)}
                >
                  View/Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-center">
        <Button
          variant="secondary"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="mx-3">Page {page} of {Math.ceil(total / limit)}</span>
        <Button
          variant="secondary"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(total / limit)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;