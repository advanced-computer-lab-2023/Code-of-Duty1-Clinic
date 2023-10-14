import React, { useState, useEffect } from "react";
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
  const [newPackagePrice, setNewPackagePrice] = useState("");
  const [newPackageSessionDiscount, setNewPackageSessionDiscount] = useState("");
  const [newPackageMedicineDiscount, setNewPackageMedicineDiscount] = useState("");
  const [newPackageFamilyDiscount, setNewPackageFamilyDiscount] = useState("");
  const [newPackageIsLatest, setNewPackageIsLatest] = useState("");
  const [healthPackages, setHealthPackages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/packages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setHealthPackages(data.result);
        //setError(null);
      } catch (error) {
        setHealthPackages([]);
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:3000/requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRequests(data.result);
    } catch (error) {
      setRequests([]);
      console.error(error.message);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data.result);
    } catch (error) {
      setUsers([]);
      console.error(error.message);
    }
  };

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [updatedPackageName, setUpdatedPackageName] = useState("");
  const [updatedPackagePrice, setUpdatedPackagePrice] = useState("");
  const [updatePackageSessionDiscount, setUpdatedPackageSessionDiscount] = useState("");
  const [updatedPackageMedicineDiscount, setUpdatedPackageMedicineDiscount] = useState("");
  const [updatedPackageFamilyDiscount, setUpdatedPackageFamilyDiscount] = useState("");
  const [updatedPackageIsLatest, setUpdatedPackageIsLatest] = useState("");

  const openUpdateModal = (packageData) => {
    setSelectedPackage(packageData);
    setUpdatedPackageName(packageData.name);
    setUpdatedPackagePrice(packageData.price);
    setUpdatedPackageSessionDiscount(packageData.sessionDiscount);
    setUpdatedPackageMedicineDiscount(packageData.medicineDiscount);
    setUpdatedPackageFamilyDiscount(packageData.familyDiscount);
    setUpdatedPackageIsLatest(packageData.isLatest);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedPackage(null);
    setUpdateModalOpen(false);
  };

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
  const handleDeleteUser = (userId) => {
    // Implement logic to delete a user
    // Example: Make an API call to delete the user with the given ID
    // After deletion, update the users list
  };

  useEffect(() => {
    fetchRequests(); // Fetch requests when the component mounts
    fetchUsers();   // Fetch users when the component mounts
  }, []);

  const handleAddHealthPackage = () => {
    const newHealthPackage = {
      id: healthPackages.length + 1,
      name: newPackageName,
      price: newPackagePrice,
      sessionDiscount: newPackageSessionDiscount,
      medicineDiscount: newPackageMedicineDiscount,
      familyDiscount: newPackageFamilyDiscount,
      isLatest: newPackageIsLatest,
    };

    setHealthPackages([...healthPackages, newHealthPackage]);
    setNewPackageName("");
    setNewPackagePrice("");
    setNewPackageIsLatest("");
    setNewPackageFamilyDiscount("");
    setNewPackageMedicineDiscount("");
    setNewPackageSessionDiscount("");
  };

  const handleUpdateHealthPackage = () => {
    if (!selectedPackage) {
      return;
    }
  
    const updatedPackageId = selectedPackage._id;
    console.log(selectedPackage._id);
  
    const updatedPackage = {
      ...selectedPackage,
      name: updatedPackageName,
      price: updatedPackagePrice,
      sessionDiscount: updatePackageSessionDiscount,
      medicineDiscount: updatedPackageMedicineDiscount,
      familyDiscount: updatedPackageFamilyDiscount,
      isLatest: updatedPackageIsLatest,
    };
  
    // Update the state with the modified package
    const updatedPackages = healthPackages.map((Package) =>
      Package._id === updatedPackageId ? updatedPackage : Package
    );
  
    setHealthPackages(updatedPackages);
    closeUpdateModal();
  };
  
  const handleDeleteHealthPackage = (packageId) => {
    const updatedPackages = healthPackages.filter((Package) => Package._id !== packageId);
    setHealthPackages(updatedPackages);
  };

  return (
    <Grid templateColumns="1fr" gap={8} ml="auto" mr="auto" maxWidth="auto" width="auto">
      <Flex align="center" justify="space-between" bg="teal.500" p={4}>
        {/* ... Your header content ... */}
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
            {/* Table headers for requests */}
            <Thead>
              <Tr>
                <Th>User Name</Th>
                <Th>Request Type</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests.map((request) => (
                <Tr key={request.id}>
                  <Td>{request.userName}</Td>
                  <Td>{request.requestType}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => handleApproveRequest(request.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleRejectRequest(request.id)}
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
            {/* Table headers for users */}
            <Thead>
              <Tr>
                <Th>User Name</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.userName}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={handleAddAdmin}
                    >
                      Add Admin
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
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
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>sessionDiscount</Th>
                    <Th>medicineDiscount</Th>
                    <Th>familyDiscount</Th>
                    <Th>isLatest</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {healthPackages.map((Package) => (
                    <Tr key={Package.id}>
                      <Td>{Package.name}</Td>
                      <Td>{Package.price}</Td>
                      <Td>{Package.sessionDiscount}</Td>
                      <Td>{Package.medicineDiscount}</Td>
                      <Td>{Package.familyDiscount}</Td>
                      <Td>{Package.isLatest}</Td>
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
                          onClick={() => handleDeleteHealthPackage(Package._id)}
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
                  <FormLabel>Price</FormLabel>
                  <Input
                    value={newPackagePrice}
                    onChange={(e) => setNewPackagePrice(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>sessionDiscount</FormLabel>
                  <Input
                    value={newPackageSessionDiscount}
                    onChange={(e) => setNewPackageSessionDiscount(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>medicineDiscount</FormLabel>
                  <Input
                    value={newPackageMedicineDiscount}
                    onChange={(e) => setNewPackageMedicineDiscount(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>familyDiscount</FormLabel>
                  <Input
                    value={newPackageFamilyDiscount}
                    onChange={(e) => setNewPackageFamilyDiscount(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>isLatest</FormLabel>
                  <Input
                    value={newPackageIsLatest}
                    onChange={(e) => setNewPackageIsLatest(e.target.value)}
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
              <FormLabel>Price</FormLabel>
              <Input
                value={updatedPackagePrice}
                onChange={(e) => setUpdatedPackagePrice(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>sessionDiscount</FormLabel>
              <Input
                value={updatePackageSessionDiscount}
                onChange={(e) => setUpdatedPackageSessionDiscount(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>medicineDiscount</FormLabel>
              <Input
                value={updatedPackageMedicineDiscount}
                onChange={(e) => setUpdatedPackageMedicineDiscount(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>familyDiscount</FormLabel>
              <Input
                value={updatedPackageFamilyDiscount}
                onChange={(e) => setUpdatedPackageFamilyDiscount(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>isLatest</FormLabel>
              <Input
                value={updatedPackageIsLatest}
                onChange={(e) => setUpdatedPackageIsLatest(e.target.value)}
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
