const   express             = require('express'),
        app                 = express(),
        bodyParser          = require('body-parser'),
        mongoose            = require('mongoose'),
        methodOverride      = require('method-override'),
        expressSanitizer    = require('express-sanitizer');

mongoose.connect('mongodb://localhost/basicBlog', { useNewUrlParser: true, useUnifiedTopology: true});

// Express config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Mongoose model config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', blogSchema);

// Routes
// INDEX Route
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        err ? console.log(err) : res.render('index', {blogs});
    });
});

// NEW Route
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// CREATE route
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        err ? res.render('new') : res.redirect('/blogs');
    });
});

// SHOW route
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        err ? res.redirect('/blogs') : res.render('show', {blog});
    });
});

// EDIT Route
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        err ? res.redirect('/blogs') : res.render('edit', {blog});
    });
});

// UPDATE Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        err ? res.redirect('/blogs') : res.redirect(`/blogs/${req.params.id}`);
    });
});

// DESTROY Route
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        err ? res.redirect('/blogs') : res.redirect('/blogs');
    });
});

app.listen('3000', () => {
    console.log('Server is rockin!');
});