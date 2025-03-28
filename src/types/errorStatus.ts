export enum ErrorStatus {
  'Warning' = 100,
  'No content' = 110,
  'Error request client' = 200,
  'Error request data' = 210,
  'Error request headers' = 220,
  'Error request method' = 230,
  'Error request URI' = 240,
  'Error working Auth service' = 300,
  'Service Auth is temporarily out of service' = 310,
  'Service Auth is closed for technical work' = 320,
}
