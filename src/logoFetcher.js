export const fetchLogoUrl = async () => {
    try {
        const response = await fetch('http://localhost/insurance/api/settings.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Assuming the response contains the logo URL in the 'logo_url' field
        return data && data.length > 0 ? data[0].logo_url : ''; // Return logo URL or empty string if not found
    } catch (error) {
        console.error('There was a problem fetching logo URL:', error);
        return ''; // Return empty string in case of error
    }
};
