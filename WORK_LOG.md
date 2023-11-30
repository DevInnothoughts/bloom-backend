## Work log
2023-11-29
- Form APIs created: init, update, get
- Multiple update APIs merged into one update API
- getForm: Fetches form data from company table instead for user

## TODO
- Ravi: Onboarding process changes: creation of user, company, bloom jwt data to come from backend
- Umang: Authentication using jwt as bearer token:
Sample jwt - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDczNzAxMjExMjM3NDIwNTY2MzEiLCJpc3MiOiJCbG9vbSBBdXRoIiwiYXVkIjoiQmxvb20gQVBJIiwiaWF0IjoxNzAxMDkwNzcxLCJ1c2VyIjp7ImlkIjoiMTA3MzcwMTIxMTIzNzQyMDU2NjMxIiwibmFtZSI6IlJhdmkgQWdyYXdhbCIsImVtYWlsIjoiYWdyYXdhbHJhdmk5NUBnbWFpbC5jb20ifSwiZXhwIjoxNzA4ODY2NzcxfQ.vO8JOjvu4PWM6vxcLqgD94v_zPImy09rkLZcAG80m9A
Sample payload (min keys) - 
```json
{
  "iss": "Bloom Auth",
  "aud": "Bloom API",
  "iat": 1701090771,
  "user": {
    "id": "107370121123742056631",
    "email": "agrawalravi95@gmail.com"
  },
  "exp": 1708866771
}
```

- Umang: Change way to fetch user from authenticated jwt. Change queries to use user.id instead of user.email
