import React, { useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Text,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

const originalDoctorsData = [
  {
    id: 1,
    name: 'Dr. John Doe',
    speciality: 'Cardiology',
    hospital: 'Hospital A',
    price: 150,
    appointments: [
      {
        id: 1,
        date: '2023-10-10',
        time: '10:00 AM',
        location: 'Room 101',
      },
      {
        id: 2,
        date: '2023-10-11',
        time: '2:00 PM',
        location: 'Room 202',
      },
    ],
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    speciality: 'Dermatology',
    hospital: 'Hospital B',
    price: 200,
    appointments: [
      {
        id: 3,
        date: '2023-10-12',
        time: '9:00 AM',
        location: 'Room 303',
      },
      {
        id: 4,
        date: '2023-10-13',
        time: '3:00 PM',
        location: 'Room 404',
      },
    ],
  },
  {
    id: 3,
    name: 'Dr. Michael Johnson',
    speciality: 'Neurology',
    hospital: 'Hospital C',
    price: 180,
    appointments: [
      {
        id: 5,
        date: '2023-10-14',
        time: '11:00 AM',
        location: 'Room 505',
      },
      {
        id: 6,
        date: '2023-10-15',
        time: '4:00 PM',
        location: 'Room 606',
      },
    ],
  },
];

const originalPrescriptionData = [
  {
    id: 1,
    medication: 'Medication A',
    dosage: '1 tablet twice a day',
    instructions: 'Take with food',
  },
  {
    id: 2,
    medication: 'Medication B',
    dosage: '2 tablets at bedtime',
    instructions: 'Avoid alcohol',
  },
  {
    id: 3,
    medication: 'Medication C',
    dosage: '1 capsule in the morning',
    instructions: 'Store in a cool, dry place',
  },
  {
    id: 4,
    medication: 'Medication D',
    dosage: '2 tablets after meals',
    instructions: 'Drink plenty of water',
  },
  {
    id: 5,
    medication: 'Medication E',
    dosage: '1 tablet daily',
    instructions: 'Take with or without food',
  },
];

const PatientPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
const [familyMemberName, setFamilyMemberName] = useState('');
const [familyMemberNationalID, setFamilyMemberNationalID] = useState('');
const [familyMemberPhone, setFamilyMemberPhone] = useState('');
const [familyMemberBirthdate, setFamilyMemberBirthdate] = useState('');
const [familyMemberGender, setFamilyMemberGender] = useState('');
const [familyMemberRelation, setFamilyMemberRelation] = useState('');

  const [doctorsData, setDoctorsData] = useState(originalDoctorsData);
  const [prescriptionData, setPrescriptionData] = useState(originalPrescriptionData);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSpecialityChange = (event) => {
    setSelectedSpeciality(event.target.value);
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleFamilyMemberNameChange = (event) => {
    setFamilyMemberName(event.target.value);
  };

  const handleFamilyMemberNationalIDChange = (event) => {
    setFamilyMemberNationalID(event.target.value);
  };

  const handleFamilyMemberGenderChange = (event) => {
    setFamilyMemberGender(event.target.value);
  };

  // const handleFamilyMemberAgeChange = (event) => {
  //   setFamilyMemberAge(event.target.value);
  // };

  const handleFilter = () => {
    let filteredDoctors = originalDoctorsData;
    let filteredPrescriptions = originalPrescriptionData;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchLower)
      );

      filteredPrescriptions = filteredPrescriptions.filter((prescription) =>
        prescription.medication.toLowerCase().includes(searchLower)
      );
    }

    if (selectedSpeciality) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.speciality === selectedSpeciality);
    }

    if (selectedHospital) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.hospital === selectedHospital);
    }

    if (minPrice) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.price >= minPrice);
    }

    if (maxPrice) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.price <= maxPrice);
    }

    setDoctorsData(filteredDoctors);
    setPrescriptionData(filteredPrescriptions);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpeciality('');
    setSelectedHospital('');
    setMinPrice('');
    setMaxPrice('');
    setDoctorsData(originalDoctorsData);
    setPrescriptionData(originalPrescriptionData);
    setSelectedPrescription(null);
    setSelectedDoctor(null); // Reset selectedDoctor
  };

  const handleAddFamilyMember = () => {
    if (
      familyMemberName &&
      familyMemberNationalID &&
      familyMemberPhone &&
      familyMemberBirthdate &&
      familyMemberGender &&
      familyMemberRelation
    ) {
      const newFamilyMember = {
        name: familyMemberName,
        nationalID: familyMemberNationalID,
        phone: familyMemberPhone,
        birthdate: familyMemberBirthdate,
        gender: familyMemberGender,
        relation: familyMemberRelation,
      };
  
      fetch("http://localhost:3000/users/me/family", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFamilyMember),
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Assuming the API returns the added family member data
          }
          throw new Error('Failed to add family member');
        })
        .then((addedFamilyMember) => {
          // Update the state with the added family member
          setFamilyMembers([...familyMembers, addedFamilyMember]);
          setFamilyMemberName('');
          setFamilyMemberNationalID('');
          setFamilyMemberPhone('');
          setFamilyMemberBirthdate('');
          setFamilyMemberGender('');
          setFamilyMemberRelation('');
        })
        .catch((error) => {
          console.error('Error adding family member:', error);
          // Handle the error as needed (e.g., show an error message)
        });
    }
  };  
  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <>
      <Flex align="center" justify="space-between" bg="teal.500" p={4}>
        <Image alt="Logo" h={8} />
        <Text color="white" fontWeight="bold">
          Welcome, {/* {user.username} ({user.email}) */}
        </Text>
      </Flex>

      {/* Search Input */}
      <FormControl my={4}>
        <FormLabel>Search by Name</FormLabel>
        <Input value={searchTerm} onChange={handleSearchChange} />
      </FormControl>

      {/* Filters */}
      <FormControl my={4}>
        <FormLabel>Speciality</FormLabel>
        <Select value={selectedSpeciality} onChange={handleSpecialityChange}>
          <option value="">All</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurology</option>
        </Select>
      </FormControl>

      <FormControl my={4}>
        <FormLabel>Hospital</FormLabel>
        <Select value={selectedHospital} onChange={handleHospitalChange}>
          <option value="">All</option>
          <option value="Hospital A">Hospital A</option>
          <option value="Hospital B">Hospital B</option>
          <option value="Hospital C">Hospital C</option>
        </Select>
      </FormControl>

      <FormControl my={4}>
        <FormLabel>Minimum Price</FormLabel>
        <Input type="number" value={minPrice} onChange={handleMinPriceChange} />
      </FormControl>

      <FormControl my={4}>
        <FormLabel>Maximum Price</FormLabel>
        <Input type="number" value={maxPrice} onChange={handleMaxPriceChange} />
      </FormControl>

      <Button colorScheme="blue" onClick={handleFilter}>
        Filter
      </Button>

      <Button colorScheme="gray" ml={2} onClick={handleResetFilters}>
        Reset Filters
      </Button>

      {/* Family Members Tab */}
      <Tabs my={4}>
        <TabList>
          <Tab>Doctors</Tab>
          <Tab>Prescriptions</Tab>
          <Tab>Family Members</Tab>
          <Tab>Appointments</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Accordion allowToggle>
              {doctorsData.map((doctor) => (
                <AccordionItem key={doctor.id}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {doctor.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <p>
                      <strong>Speciality:</strong> {doctor.speciality}
                    </p>
                    <p>
                      <strong>Hospital:</strong> {doctor.hospital}
                    </p>
                    <p>
                      <strong>Price:</strong> ${doctor.price}
                    </p>
                    <Button colorScheme="blue" onClick={() => handleSelectDoctor(doctor)}>
                      Select Doctor
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </TabPanel>

          <TabPanel>
            <Accordion allowToggle>
              {prescriptionData.map((prescription) => (
                <AccordionItem key={prescription.id}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Prescription ID: {prescription.id}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <p>
                      <strong>Medication:</strong> {prescription.medication}
                    </p>
                    <p>
                      <strong>Dosage:</strong> {prescription.dosage}
                    </p>
                    <p>
                      <strong>Instructions:</strong> {prescription.instructions}
                    </p>
                    <Button colorScheme="blue" onClick={() => handleSelectPrescription(prescription)}>
                      Select Prescription
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </TabPanel>

          <TabPanel>
            {/* Family Members Table */}
            <Table variant="simple">
  <Thead>
    <Tr>
      <Th>Name</Th>
      <Th>National ID</Th>
      <Th>Phone</Th>
      <Th>Birthdate</Th>
      <Th>Gender</Th>
      <Th>Relation to patient</Th>
    </Tr>
  </Thead>
  <Tbody>
    {familyMembers.map((familyMember, index) => (
      <Tr key={index}>
        <Td>{familyMember.name}</Td>
        <Td>{familyMember.nationalID}</Td>
        <Td>{familyMember.phone}</Td>
        <Td>{familyMember.birthdate}</Td>
        <Td>{familyMember.gender}</Td>
        <Td>{familyMember.relation}</Td>
      </Tr>
    ))}
  </Tbody>
</Table>

            {/* Add Family Member Form */}
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                value={familyMemberName}
                onChange={handleFamilyMemberNameChange}
                placeholder="Name"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>National ID</FormLabel>
              <Input
                value={familyMemberNationalID}
                onChange={handleFamilyMemberNationalIDChange}
                placeholder="National ID"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Relation to patient</FormLabel>
              <Select
                value={familyMemberGender}
                onChange={handleFamilyMemberGenderChange}
                placeholder="Select relation"
              >
                <option value="Husband">Husband</option>
                <option value="Wife">Wife</option>
                <option value="Child">Child</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>PatientID</FormLabel>
              <Input
                // value={familyMemberAge}
                // onChange={handleFamilyMemberAgeChange}
                placeholder="PatientID"
              />
            </FormControl>
            <Button
              colorScheme="blue"
              mt={4}
              onClick={handleAddFamilyMember}
            >
              Add Family Member
            </Button>
          </TabPanel>

          <TabPanel>
            <Accordion allowToggle>
              {originalDoctorsData.map((doctor) => (
                <AccordionItem key={doctor.id}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {doctor.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {doctor.appointments.map((appointment) => (
                      <div key={appointment.id}>
                        <p>
                          <strong>Date:</strong> {appointment.date}
                        </p>
                        <p>
                          <strong>Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>Location:</strong> {appointment.location}
                        </p>
                      </div>
                    ))}
                    <Button colorScheme="blue" onClick={() => handleSelectDoctor(doctor)}>
                      Select Doctor
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {selectedPrescription && (
        <Box my={4}>
          <p>Selected Prescription:</p>
          <p>
            <strong>Medication:</strong> {selectedPrescription.medication}
          </p>
          <p>
            <strong>Dosage:</strong> {selectedPrescription.dosage}
          </p>
          <p>
            <strong>Instructions:</strong> {selectedPrescription.instructions}
          </p>
        </Box>
      )}

      {selectedDoctor && (
        <Box my={4}>
          <p>Selected Doctor:</p>
          <p>
            <strong>Name:</strong> {selectedDoctor.name}
          </p>
          <p>
            <strong>Speciality:</strong> {selectedDoctor.speciality}
          </p>
          <p>
            <strong>Hospital:</strong> {selectedDoctor.hospital}
          </p>
          <p>
            <strong>Price:</strong> ${selectedDoctor.price}
          </p>
        </Box>
      )}
    </>
  );
};

export default PatientPage;
