export default async function senderEmail(title: string, name: string, email: string): Promise<boolean> {
  const data = {
    title,
    name,
    email,
  };

  try {
    const response = await fetch(`/api/sendEmail`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}
