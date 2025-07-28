const { getCollections, ObjectId } = require('./db');

const sampleCourses = [
  {
    _id: new ObjectId('6873e22fe8214df0ed190b23'), // Ensure this ID exists
    title: "Beginner Guitar Essentials",
    instructor: "John Smith",
    description: "Learn the basics of guitar playing, including chords, strumming, and simple songs.",
    price: 49.99,
    image: "IMG/guitar-course.jpg",
    level: "Beginner",
    duration: 10,
    features: ["Chords", "Strumming", "Simple Songs"],
    videoUrl: "https://www.youtube.com/watch?v=example1",
    videoImageUrl: "IMG/guitar-video-thumb.jpg",
    category: "Guitar",
    enrolledCount: 0,
    rating: 4.5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... other sample courses (omitted for brevity)
];

const sampleRatings = [
  {
    courseId: new ObjectId('6873e22fe8214df0ed190b23'),
    userId: new ObjectId('user1234567890123456789012'), // Replace with a valid user ID
    rating: 4.5,
    review: "Great course for beginners!",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedData() {
  const { courses, ratings } = await getCollections();
  try {
    // Seed courses
    const existingCourses = await courses.find({ _id: { $in: sampleCourses.map(c => c._id) } }).toArray();
    if (existingCourses.length === 0) {
      await courses.insertMany(sampleCourses);
      console.log(Inserted ${sampleCourses.length} courses);
    } else {
      console.log('Courses already seeded');
    }

    // Seed ratings
    const existingRatings = await ratings.find({ courseId: sampleRatings[0].courseId }).toArray();
    if (existingRatings.length === 0) {
      await ratings.insertMany(sampleRatings);
      console.log(Inserted ${sampleRatings.length} ratings);
    } else {
      console.log('Ratings already seeded');
    }
  } catch (error) {
    console.error('Seed data error:', error);
    throw error;
  }
}

module.exports = { seedData, sampleCourses, sampleRatings };
