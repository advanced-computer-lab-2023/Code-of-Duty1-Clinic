const SubscriptionCard = (Package) => {
    const [subscribed, setSubscribed] = useState(false);
  
    const handleSubscription = () => {
      // Implement your subscription logic here
      if (subscribed) {
        // Additional functionality for managing subscription
        console.log('Manage Subscription logic');
      } else {
        // Logic for initial subscription
        console.log('Subscribe logic');
      }
      setSubscribed(!subscribed);
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