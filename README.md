<h1>Shopping Cart in MEAN Stack</h1>
<p>This is a web application employing the shopping cart functionality with the following features: </p>
<p><b>Key features</b></p>
<ul>
    <li>Dynamic products content from database</li>
    <li>Shopping cart functionality</li>
    <li>Stripe payment integration</li>
    <li>Products order confirmation email</li>
    <li>Protection provided against CSRF attacks</li>
</ul>

<p>Other features</p>
<p style="text-align: justify;">Front end form controls validation, front end regex pattern match, password confirmation, sending email verification, registration confirmation email, frontend route guards, backend user schema validation, password hashing encryption, jwt send/receive, http interceptor, backend route restrictions, backend regex pattern match, google captcha implementation, password reveal eye, forgot password/username functionality with email, role based authorization for admin, OAuth login using Google, pop-out modal for logout, pop-out modal for session expire warnings.</p>
    
<h1>Front-End</h1>
<ul>
    <li>The code is divided into different modules and components / services / guards for better scalability and readability.</li>
    <li>Modules created - Root Module, ProductsModule, AdminModule, AuthModule, StaticPagesModule</li>
    <li>Root Module components - AppComponent, HeaderComponent</li>
    <li>ProductsModule components / services / guards - ProductsListComponent, ShoppingCartComponent, CheckoutComponent, ProductsService, LoggedGuard</li>
    <li>AdminModule components / services - ManagementComponent, EditUserComponent, ManagementService, PermissionGuard, AuthInterceptor</li>
    <li>AuthModule components / services - RegistrationComponent, LoginComponent, DashboardComponent, SocialComponent, ActivationComponent, ResendActivationLinkComponent, SocialErrorComponent, ForgotUsernameComponent, ForgotPasswordComponent, NewPasswordComponent, CheckSessionComponent, UserService, LoggedGuard, NotLoggedGuard, AuthInterceptor, RecaptchaSettings, HttpClientXsrfModule</li>
    <li>StaticPagesModule components - AboutUsComponent</li>
</ul>

<h1>Back-End</h1>
<ul>
    <li>Models created in MongoDB database - User model, Product model, Cart Model, Order model</li>
    <li>User model is created to store all the user registration / permission details</li>
    <li>Product model is created to store all the product information details</li>
    <li>Cart model is created to store the active shopping cart details</li>
    <li>Order model is created to store the paid order details (e.g. user, cart, name, address, paymentId, etc.) </li>
    <li>Lots of REST APIs created using these models for various CRUD operations</li>
    <li>csurf library is used to create Node.js CSRF protection middleware to protect against CSRF (Cross-side request forgery) attacks</li>
    <li>Multer NodeJS middleware used for uploading product image files. Only jpeg/png files are allowed. Max file size of 5 MB is allowed</li>
    <li>PassportJS 'passport-google-oauth20' strategy used for social login via Google</li>
    <li>PassportJS 'passport-github' strategy used for social login via Github</li>
    <li>Nodemailer, Mailgun used for sending emails to user for order placement, registration verification/confirmation, forgot username/password</li>
    <li>bcrypt library used for password hashing / encryption</li>
    <li>mongoose-title-case plugin used for converting user names to title case</li>
    <li>jsonwebtoken library used for issuing/verifying login authentication tokens</li>
    <li>Google Recaptcha key used in the backend for captcha confirmation</li>
</ul>

<h1>Technologies Used</h1>
<ul>
    <li>Angular</li>
    <li>NodeJS</li>
    <li>ExpressJS</li>
    <li>MongoDB</li>
    <li>Bootstrap</li>
    <li>jQuery</li>
</ul>

<h1>Screenshots</h1>
<img src="./images/Screenshot 2020-08-30 at 2.31.48 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.32.00 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.33.20 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.33.34 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.34.04 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.34.53 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.35.27 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.38.30 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.42.34 AM.png" alt="">
<img src="./images/Screenshot 2020-08-30 at 2.42.55 AM.png" alt="">
