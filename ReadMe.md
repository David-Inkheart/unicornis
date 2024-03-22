# **Unicornis**

[API Documentation](https://documenter.getpostman.com/view/27102918/2sA35Ba47e)

## **Description**

unicornis is a simple and lightweight RESTful API that allows you to create and manage unicorns in a store.

## **Pull image and run**

Pull the image from docker hub

```bash
docker pull davidokolie/unicornis:latest
```

Run the image

```bash
docker run --name unicornis -p 3000:3000/tcp -d davidokolie/unicornis:latest
```

The API should be running on `http://localhost:3000/v1`

## **Setup locally**

Clone repository

```bash
git clone https://github.com/David-Inkheart/unicornis.git
```

Add environment variables

```bash
cp env.example .env
```

Request for Environment variable values and replace them in the newly created `env` file.

### **Install dependencies**

Install dependencies in root and in each services folder

```bash
npm install
```

### **Running the API**

To run the API locally without containerization, run the following command:

```bash
npm run dev
```

---

## Testing

For unit tests, run `npm run test`

# Authentication

Auth for user actions are done using bearer token

# Tools/Stack

NodeJs, Express, Typescript, MongoDB, Redis, Docker, Jest
