import { Box, Button, ChakraProvider, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const PatientRegistrationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  mobileNumber: Yup.string().required("mobile number is required"),
  emergencyContact_fullName: Yup.string().required("FullName is required"),
  emergencyContact_mobileNumber: Yup.string().required("Emergency mobile number is required"),
  relation: Yup.string().required("relation is required"),

});

const DoctorRegistrationSchema = Yup.object().shape({
  doctorUsername: Yup.string().required("Username is required"),
  doctorName: Yup.string().required("Name is required"),
  doctorEmail: Yup.string().email("Invalid email").required("Email is required"),
  doctorPassword: Yup.string().required("Password is required"),
  doctorDateOfBirth: Yup.date().required("Date of Birth is required"),
  hourRate: Yup.number().required("Hourly Rate is required"),
  affiliation: Yup.string().required("Affiliation is required"),
  educationalBackground: Yup.string().required("Educational Background is required"),
})


const Register = () => {
  const patientHandleSubmit = async (values, actions) => {
    console.log(values);
    try {
      const response = await fetch('http://localhost:3070/auth/register/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values, role: "Patient", birthDate: values.dateOfBirth, phone: values.mobileNumber, name: { first: values.name, last: values.name + " last" }, emergencyContact:
            [{ name: values.emergencyContact_fullName, phone: values.emergencyContact_mobileNumber, relation: values.relation }]
        }),
      });
      console.log(response)
      if (response.ok) {
        // Registration successful
        console.log('Patient registration successful');
        actions.setSubmitting(false);
      } else {
        // Handle registration error
        console.error('Patient registration failed');
        actions.setSubmitting(false);
      }
    } catch (error) {
      // Handle network or API error
      console.error('API call error:', error);
      actions.setSubmitting(false);
    }
  };




  const DoctorHandleSubmit = async (values, actions) => {
    try {
      const response = await fetch('your_doctor_registration_api_endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Registration successful
        console.log('Doctor registration successful');
        actions.setSubmitting(false);
      } else {
        // Handle registration error
        console.error('Doctor registration failed');
        actions.setSubmitting(false);
      }
    } catch (error) {
      // Handle network or API error
      console.error('API call error:', error);
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Stack spacing={4} maxW="400px" mx="auto">
        <Tabs>
          <TabList>
            <Tab>Register as a Patient</Tab>
            <Tab>Register as a Doctor</Tab>
          </TabList>

          <TabPanels>
            <Formik
              initialValues={{
                username: "",
                name: "",
                email: "",
                password: "",
                birthDate: "",
                gender: "Male",
                mobileNumber: "",
                emergencyContact_fullName: "",
                emergencyContact_mobileNumber: "",
                relation: "Child"

              }}
              validationSchema={PatientRegistrationSchema}
              onSubmit={patientHandleSubmit}>
              {(formik) => (
                <Form>
                  <TabPanel>
                    {/* Patient Registration Form */}
                    <Field name="username">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.username && form.touched.username}>
                          <FormLabel htmlFor="username">Username</FormLabel>
                          <Input {...field} id="username" placeholder="Enter your username" />
                          <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="name">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input {...field} id="name" placeholder="Enter your name" />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <Input {...field} id="email" placeholder="Enter your email" />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input {...field} type="password" id="password" placeholder="Enter your password" />
                          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="dateOfBirth">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.dateOfBirth && form.touched.dateOfBirth}>
                          <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                          <Input {...field} type="date" id="dateOfBirth" placeholder="Enter your date of birth" />
                          <FormErrorMessage>{form.errors.dateOfBirth}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="gender">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.gender && form.touched.gender}>
                          <FormLabel htmlFor="gender">gender</FormLabel>
                          <Input {...field} id="gender" placeholder="Enter your gender" />
                          <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="mobileNumber">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.mobileNumber && form.touched.mobileNumber}>
                          <FormLabel htmlFor="mobileNumber">mobileNumber</FormLabel>
                          <Input {...field} id="mobileNumber" placeholder="Enter your mobile number" />
                          <FormErrorMessage>{form.errors.mobileNumber}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>


                    <Field name="emergencyContact_fullName">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.emergencyContact_fullName && form.touched.emergencyContact_fullName}>
                          <FormLabel htmlFor="emergencyContact_fullName">emergencyContact_fullName</FormLabel>
                          <Input {...field} id="emergencyContact_fullName" placeholder="Enter your full name" />
                          <FormErrorMessage>{form.errors.emergencyContact_fullName}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="emergencyContact_mobileNumber">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.emergencyContact_mobileNumber && form.touched.emergencyContact_mobileNumber}>
                          <FormLabel htmlFor="emergencyContact_mobileNumber">emergencyContact_mobileNumber</FormLabel>
                          <Input {...field} type="numeric" id="emergencyContact_mobileNumber" placeholder="Enter your emergency contact" />
                          <FormErrorMessage>{form.errors.emergencyContact_mobileNumber}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="relation">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.relation && form.touched.relation}>
                          <FormLabel htmlFor="relation">emergencyContact_relation [ 'Husband' | 'Wife' | 'Child']</FormLabel>
                          <Input {...field} id="relation" placeholder="Enter Relation " />
                          <FormErrorMessage>{form.errors.relation}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    {/* Submit button */}
                    <Button
                      mt={6}
                      colorScheme="teal"
                      isLoading={formik.isSubmitting}
                      type="submit"
                      isFullWidth
                    >
                      Register
                    </Button>
                  </TabPanel>
                </Form>
              )}
            </Formik>
            <Formik
              initialValues={{
                doctorUsername: "",
                doctorName: "",
                doctorEmail: "",
                doctorPassword: "",
                doctorDateOfBirth: "",
                hourRate: "",
                affiliation: "",
                educationalBackground: "",
              }}
              validationSchema={DoctorRegistrationSchema}
              onSubmit={DoctorHandleSubmit}>
              {(formik) => (
                <Form>
                  <TabPanel>
                    {/* Doctor Registration Form */}
                    <Field name="doctorUsername">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.doctorUsername && form.touched.doctorUsername}>
                          <FormLabel htmlFor="doctorUsername">Username</FormLabel>
                          <Input {...field} id="doctorUsername" placeholder="Enter your username" />
                          <FormErrorMessage>{form.errors.doctorUsername}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="doctorName">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.doctorName && form.touched.doctorName}>
                          <FormLabel htmlFor="doctorName">Name</FormLabel>
                          <Input {...field} id="doctorName" placeholder="Enter your name" />
                          <FormErrorMessage>{form.errors.doctorName}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="doctorEmail">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.doctorEmail && form.touched.doctorEmail}>
                          <FormLabel htmlFor="doctorEmail">Email</FormLabel>
                          <Input {...field} id="doctorEmail" placeholder="Enter your email" />
                          <FormErrorMessage>{form.errors.doctorEmail}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="doctorPassword">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.doctorPassword && form.touched.doctorPassword}>
                          <FormLabel htmlFor="doctorPassword">Password</FormLabel>
                          <Input {...field} type="password" id="doctorPassword" placeholder="Enter your password" />
                          <FormErrorMessage>{form.errors.doctorPassword}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="doctorDateOfBirth">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.doctorDateOfBirth && form.touched.doctorDateOfBirth}>
                          <FormLabel htmlFor="doctorDateOfBirth">Date of Birth</FormLabel>
                          <Input {...field} type="date" id="doctorDateOfBirth" placeholder="Enter your date of birth" />
                          <FormErrorMessage>{form.errors.doctorDateOfBirth}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="hourRate">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.hourRate && form.touched.hourRate}>
                          <FormLabel htmlFor="hourRate">Hourly Rate</FormLabel>
                          <Input {...field} id="hourRate" placeholder="Enter your hourly rate" />
                          <FormErrorMessage>{form.errors.hourRate}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="affiliation">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.affiliation && form.touched.affiliation}>
                          <FormLabel htmlFor="affiliation">Affiliation</FormLabel>
                          <Input {...field} id="affiliation" placeholder="Enter your affiliation" />
                          <FormErrorMessage>{form.errors.affiliation}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="educationalBackground">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.educationalBackground && form.touched.educationalBackground}>
                          <FormLabel htmlFor="educationalBackground">Educational Background</FormLabel>
                          <Input {...field} id="educationalBackground" placeholder="Enter your educational background" />
                          <FormErrorMessage>{form.errors.educationalBackground}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    {/* Submit button */}
                    <Button
                      mt={6}
                      colorScheme="teal"
                      isLoading={formik.isSubmitting}
                      type="submit"
                      isFullWidth
                    >
                      Submit registration request
                    </Button>
                  </TabPanel>
                </Form>
              )}
            </Formik>

          </TabPanels>
        </Tabs>
      </Stack>
    </>
  );
};


export default Register;