import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  Flex,
  Image
} from '@chakra-ui/react';

const DoctorPage = () => {
  const [doctorInfo, setDoctorInfo] = useState({
    email: 'doctor@example.com',
    hourlyRate: 200,
    hospitalAffiliation: 'ABC Hospital',
  });

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 35,
      phone: '123-456-7890',
      healthRecord: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 45,
      phone: '987-654-3210',
      healthRecord: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    // ... Other patients' data ...
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientId: 1,
      date: '2023-10-15',
      time: '10:00 AM',
    },
    {
      id: 2,
      patientId: 2,
      date: '2023-10-16',
      time: '2:00 PM',
    },
    {
      id: 3,
      patientId: 3,
      date: '2023-10-17',
      time: '11:00 AM',
    },
    // ... Other appointments' data ...
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');


  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleSelectPatient = (patient) => {
    // Logic to handle when a patient is selected
    console.log('Selected patient:', patient);
  };

  const handleUpdateDoctorInfo = (e) => {
    e.preventDefault();
    // Logic to update doctor's information
    console.log('Updated doctor info:', doctorInfo);
  };

  const handleRequestChange = (e) => {
    e.preventDefault();
    // Logic to submit request for change
    console.log('Requesting change:', doctorInfo);
  };

  const handleFilterAppointments = () => {
    const selectedFilter = document.getElementById('appointmentFilter').value;
    if (selectedFilter === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) =>
        appointments.some((appointment) => appointment.patientId === patient.id && appointment.date === selectedFilter)
      );
      setFilteredPatients(filtered);
    }
  };

  return (
    <>
      <Flex align="center" justify="space-between" bg="teal.500" p={4}>
        <Image alt="Logo" h={8} />
        <Text color="white" fontWeight="bold">
          Welcome, {/* {user.username} ({user.email}) */}
        </Text>
      </Flex>
      <Tabs my={4}>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Patients</Tab>
          <Tab>Request Change</Tab>
          <Tab>Appointments</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form onSubmit={handleUpdateDoctorInfo}>
              <FormControl mb={4}>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  value={doctorInfo.email}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, email: e.target.value })}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Hourly Rate:</FormLabel>
                <Input
                  type="number"
                  value={doctorInfo.hourlyRate}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, hourlyRate: e.target.value })}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Hospital Affiliation:</FormLabel>
                <Input
                  value={doctorInfo.hospitalAffiliation}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, hospitalAffiliation: e.target.value })}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue">
                Update
              </Button>
            </form>
          </TabPanel>

          <TabPanel>
            <Box mb={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="search" mb="0" mr={2}>
                  Search:
                </FormLabel>
                <Input id="search" value={searchQuery} onChange={handleInputChange} />

                <Button ml={2} onClick={handleSearch}>
                  Search
                </Button>
              </FormControl>
            </Box>

            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Age</Th>
                  <Th>Phone</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <Tr key={patient.id}>
                      <Td>{patient.name}</Td>
                      <Td>{patient.age}</Td>
                      <Td>{patient.phone}</Td>
                      <Td>
                        <Button colorScheme="blue" size="sm" onClick={() => handleSelectPatient(patient)}>
                          View Records
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4}>
                      <Text>No patients found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <form onSubmit={handleRequestChange}>
              <FormControl mb={4}>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  value={doctorInfo.email}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, email: e.target.value })}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Hourly Rate:</FormLabel>
                <Input
                  type="number"
                  value={doctorInfo.hourlyRate}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, hourlyRate: e.target.value })}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Hospital Affiliation:</FormLabel>
                <Input
                  value={doctorInfo.hospitalAffiliation}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, hospitalAffiliation: e.target.value })}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue">
                Request Change
              </Button>
            </form>
          </TabPanel>

          <TabPanel>
  <Box mb={4}>
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="appointmentFilter" mb="0" mr={2}>
        Filter by Appointment Date:
      </FormLabel>
      <Input
        type="date"
        id="appointmentFilter"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
      />

      <Button ml={2} onClick={handleFilterAppointments}>
        Apply
      </Button>
    </FormControl>
  </Box>

  <Table variant="striped" colorScheme="gray">
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th>Age</Th>
        <Th>Phone</Th>
        <Th>Appointment Date</Th>
        <Th>Actions</Th>
      </Tr>
    </Thead>
    <Tbody>
      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient) => (
          <Tr key={patient.id}>
            <Td>{patient.name}</Td>
            <Td>{patient.age}</Td>
            <Td>{patient.phone}</Td>
            <Td>
              {appointments
                .filter((appointment) => appointment.patientId === patient.id)
                .map((appointment) => (
                  <div key={appointment.id}>
                    {appointment.date}
                  </div>
                ))}
            </Td>
            <Td>
              <Button colorScheme="blue" size="sm" onClick={() => handleSelectPatient(patient)}>
                View Records
              </Button>
            </Td>
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={5}>
            <Text>No patients found.</Text>
          </Td>
        </Tr>
      )}
    </Tbody>
  </Table>
</TabPanel>

        </TabPanels>
      </Tabs>
    </>
  );
};

export default DoctorPage;
