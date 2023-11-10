import { Box, Button, ChakraProvider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Image, Input, Link, Stack } from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (values, actions) => {
    setTimeout(() => {
      actions.setSubmitting(false);
      console.log(values);
      // Perform login logic here

      // Redirect to the registration form
      navigate("/PatientPage");
    }, 1000);
  };

  const handleGuestLogin = () => {
    // Perform guest login logic here

    // Redirect to the desired guest page
    navigate("/GuestPage");
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form>
          <Stack spacing={4} maxW="400px" mx="auto">

            {/* Logo */}
            <Box mx="auto" mb={6}>
              <Image src="https://tse2.mm.bing.net/th?id=OIP.ptQc1PvE-rxoc_4BSSQIBwAAAA&pid=Api&P=0&h=220" alt="Logo" />
            </Box>

            {/* Email Input */}
            <Field name="email">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.email && form.touched.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...field} id="email" placeholder="Enter your email" />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            {/* Password Input */}
            <Field name="password">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.password && form.touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input {...field} type="password" id="password" placeholder="Enter your password" />
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            {/* Submit Button */}
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={formik.isSubmitting}
              type="submit"
            >
              Sign In
            </Button>

            {/* Guest Login Button */}
            <Button
              mt={2}
              colorScheme="gray"
              variant="outline"
              onClick={handleGuestLogin}
            >
              Guest Login
            </Button>

            {/* Register Link */}
            <Flex justify="center" fontSize="sm">
              Don't have an account?{" "}
              <Link color="teal.500" onClick={() => navigate("/Register")}>
                Register
              </Link>
            </Flex>

          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default Login;