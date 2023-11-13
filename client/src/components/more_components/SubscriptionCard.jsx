import axios from 'axios';
const SubscriptionCard = (Package) => {
    const [subscribed, setSubscribed] = useState(false);
  
    const handleSubscription = () => {
      
      if (subscribed) {
        // Additional functionality for managing subscription e.g. UNsubscribe
        console.log('Manage Subscription logic');
      } else {
        axios.post('http://localhost:3000/payment/session/${Package.price}/${Package.name}', {})
          .then(response => {
            // Handle the success response
            window.location.href = response.url;
            setSubscribed(true);
            console.log('Subscribe logic - Axios success:', response.data);
          })
          .catch(error => {
            // Handle errors
            console.error('Subscribe logic - Axios error:', error);
          });
        console.log('Subscribe logic');
      }
      //setSubscribed(!subscribed);
    };
  
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {Package.name}
          </Typography>
          <Typography color="text.secondary">
            Price: {Package.price}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Description of the subscription.
          </Typography>
          {subscribed && (
            <Typography
              color="primary"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'green',
                color: 'white',
                padding: '4px',
                borderTopLeftRadius: '4px',
              }}
            >
              Subscribed
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleSubscription}
            sx={{ mt: 2 }}
          >
            {subscribed ? 'Manage Subscription' : 'Subscribe'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  export default SubscriptionCard;