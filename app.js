var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    method      = require("method-override"),
    app         = express();

    // Middleware
    app.use(method("_method"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.set("view engine", "ejs");

    // MongoDB Connection
    mongoose.connect('mongodb://bekraf:pwd123456!!@ds157641.mlab.com:57641/bekraf_nodedb');
    var campSchema = new mongoose.Schema({
        title: String,
        image: String,
        description: String
    })

    var campGround = mongoose.model('Campground', campSchema);

    // campGround.create({
    //     title: 'Camp Villa',
    //     image: 'http://d1enrelpb4k7zs.cloudfront.net/wp-content/uploads/2011/08/grand-canyon-camping.jpg',
    //     description: 'hitam'
    //     }, function(error, cat) {
    //         if (error) {
    //             console.log(error)
    //         } else {
    //             console.log(cat)
    //         }
    //     });


app.get("/", function(request, response) {
    response.redirect("/campgrounds")
});

app.get("/campgrounds", function(request, response) {
    campGround.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log(error)
        } else {
            response.render('index', {camp: allCampgrounds})
        }
    })
});

app.get("/campgrounds/new", function(request, response) {
    response.render("new_camp");
});

app.post("/campgrounds", function(request, response) {
    var title       = request.body.title;
    var image       = request.body.image;
    var description = request.body.description;

    var newCamp = {title: title, image: image, description: description};

    campGround.create(newCamp, function(error, newCamp) {
        if(error) {
            console.log(error)
        } else {
            response.redirect("/")
        }
    })
});

// View Detail
app.get("/campgrounds/:id", function(request, response) {
    campGround.findById(request.params.id, function(error, foundCamp) {
        if(error) {
            console.log(error)
        } else {
            response.render("show", {camp: foundCamp})
        }
    })
});

// Edit
app.get("/campgrounds/:id/edit", function(request, response) {
    campGround.findById(request.params.id, function(error, foundCamp) {
        if(error) {
            console.log(error)
        } else {
            response.render("edit", {camp: foundCamp})
        }
    })
})

app.put("/campgrounds/:id", function(request, response) {
    campGround.findByIdAndUpdate(request.params.id, request.body.camp, function(error, updateItem) {
        if(error) {
            console.log(error)
        } else {
            response.redirect(request.params.id)
        }
    })
})

app.delete("/campgrounds/:id", function(request, response) {
    campGround.findByIdAndRemove(request.params.id, function(error) {
        if(error) {
            console.log(error)
        } else {
            response.render("index")
        }
    })
})

app.listen(3000, function(error) {
    console.log("server starting")
});
