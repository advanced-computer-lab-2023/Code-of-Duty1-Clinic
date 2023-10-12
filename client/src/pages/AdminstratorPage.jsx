import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const AdministratorPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newPackageName, setNewPackageName] = useState("");
  const [newPackageDescription, setNewPackageDescription] = useState("");
  const [newPackagePrice, setNewPackagePrice] = useState("");
  const [healthPackages, setHealthPackages] = useState([
    {
      id: 1,
      name: "Package 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: "$99",
    },
    {
      id: 2,
      name: "Package 2",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      price: "$149",
    },
    {
      id: 3,
      name: "Package 3",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      price: "$199",
    },
  ]);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [updatedPackageName, setUpdatedPackageName] = useState("");
  const [updatedPackageDescription, setUpdatedPackageDescription] = useState("");
  const [updatedPackagePrice, setUpdatedPackagePrice] = useState("");

  const openUpdateModal = (packageData) => {
    setSelectedPackage(packageData);
    setUpdatedPackageName(packageData.name);
    setUpdatedPackageDescription(packageData.description);
    setUpdatedPackagePrice(packageData.price);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedPackage(null);
    setUpdateModalOpen(false);
  };

  const usersData = [
    { id: 1, type: "Admin", username: "admin1" },
    { id: 2, type: "Doctor", username: "doctor1" },
    { id: 3, type: "Patient", username: "patient1" },
    { id: 4, type: "Doctor", username: "doctor2" },
    { id: 5, type: "Patient", username: "patient2" },
  ];

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const handleAddAdmin = () => {
    // Implement add admin logic here
    console.log(`Add admin: username=${newAdminUsername}, password=${newAdminPassword}`);
    setNewAdminUsername("");
    setNewAdminPassword("");
  };

  const handleApproveRequest = (userId) => {
    // Implement approve request logic here
    console.log(`Approve request for user with ID ${userId}`);
  };

  const handleRejectRequest = (userId) => {
    // Implement reject request logic here
    console.log(`Reject request for user with ID ${userId}`);
  };

  const handleAddHealthPackage = () => {
    const newHealthPackage = {
      id: healthPackages.length + 1,
      name: newPackageName,
      description: newPackageDescription,
      price: newPackagePrice,
    };

    setHealthPackages([...healthPackages, newHealthPackage]);
    setNewPackageName("");
    setNewPackageDescription("");
    setNewPackagePrice("");
  };

  const handleUpdateHealthPackage = () => {
    const updatedPackage = {
      ...selectedPackage,
      name: updatedPackageName,
      description: updatedPackageDescription,
      price: updatedPackagePrice,
    };

    const updatedPackages = healthPackages.map((Package) =>
      Package.id === updatedPackage.id ? updatedPackage : Package
    );

    setHealthPackages(updatedPackages);
    closeUpdateModal();
  };

  const handleDeleteHealthPackage = (packageId) => {
    const updatedPackages = healthPackages.filter((Package) => Package.id !== packageId);
    setHealthPackages(updatedPackages);
  };

  return (
    <Grid templateColumns="1fr" gap={8} ml="auto" mr="auto" maxWidth="auto" width="auto">
      <Flex align="center" justify="space-between" bg="teal.500" p={4}>
        <Image alt="Logo" h={8} />
        <Text color="white" fontWeight="bold">
          Welcome, {/* User info */}
        </Text>
      </Flex>

      <Container maxW="auto">
        <Heading size="lg" mb={4}>
          Administrator Page
        </Heading>

        <Tabs index={selectedTab} onChange={handleTabChange}>
          <TabList>
            <Tab>Requests</Tab>
            <Tab>Users</Tab>
            <Tab>Health Packages</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Type</Th>
                    <Th>Username</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {usersData.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.type}</Td>
                      <Td>{user.username}</Td>
                      <Td>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          mr={2}
                          onClick={() => handleApproveRequest(user.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRejectRequest(user.id)}
                        >
                          Reject
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>

            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Username</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {usersData.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.type}</Td>
                      <Td>{user.username}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Stack direction="row" mt={4} align="center">
                <Input
                  placeholder="Username"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
                <Button colorScheme="teal" onClick={handleAddAdmin} size="lg">
                  Add Admin
                </Button>
              </Stack>
            </TabPanel>

            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Price</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {healthPackages.map((Package) => (
                    <Tr key={Package.id}>
                      <Td>{Package.name}</Td>
                      <Td>{Package.description}</Td>
                      <Td>{Package.price}</Td>
                      <Td>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          onClick={() => openUpdateModal(Package)}
                        >
                          Update
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDeleteHealthPackage(Package.id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Box mt={4}>
                <Heading size="sm">Add Health Package</Heading>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newPackageName}
                    onChange={(e) => setNewPackageName(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={newPackageDescription}
                    onChange={(e) => setNewPackageDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Price</FormLabel>
                  <Input
                    value={newPackagePrice}
                    onChange={(e) => setNewPackagePrice(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="teal"
                  size="md"
                  mt={4}
                  onClick={handleAddHealthPackage}
                >
                  Add Package
                </Button>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Health Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={updatedPackageName}
                onChange={(e) => setUpdatedPackageName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={updatedPackageDescription}
                onChange={(e) => setUpdatedPackageDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                value={updatedPackagePrice}
                onChange={(e) => setUpdatedPackagePrice(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleUpdateHealthPackage}>
              Update
            </Button>
            <Button colorScheme="red" onClick={closeUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default AdministratorPage;
