import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import BookCard from "./BookCard";

import "../assets/Styles/TopBooks.css";

function TopBooks() {
  const [bookData, setBookData] = useState([]);
  const [error, setError] = useState(null);

  const TopBooks = [
    { title: "Iron Flame, Book 2" },
    { title: "Happy Place" },
    { title: "Love, Theoretically" },
    {
      title:
        "The Stolen Heir: A Novel of Elfhame, The No 1 Sunday Times Bestseller 2023"
    },
    {
      title:
        "A Curse For True Love: the thrilling final book in the Once Upon a Broken Heart series"
    },
    { title: "Yellowface " },
    { title: "The Bee Sting: A Novel" },
    { title: "Tress of the Emerald Sea: A Cosmere Novel" },
    { title: "the heaven and earth grocery store" },
    { title: "Chain Gang All Stars" }
  ];

  useEffect(() => {
    const apiKey = "AIzaSyCvF51voi8E3lwf44fOIkQ75VwWJXkzuVk";

    const fetchBooks = async () => {
      try {
        let newBookData = JSON.parse(localStorage.getItem("bookData"));

        if (!newBookData) {
          const promises = TopBooks.map((book) => {
            const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${book.title}` +
            `&printType=books` +
            `&fields=items(id,volumeInfo)` +
            `&key=${apiKey}` +
            `&language=en`;
            return fetch(url).then((response) => response.json());
          });

          const booksData = await Promise.all(promises);

          newBookData = booksData.flatMap((data) => {
            const filteredData = data.items.filter(
              (item) => item.volumeInfo.pageCount
            );
            return filteredData.length > 0 ? [filteredData[0]] : [];
          });
          localStorage.setItem("bookData", JSON.stringify(newBookData));
        }

        setBookData(newBookData);
      } catch (err) {
        setError("Error fetching book data.");
      }
    };

    fetchBooks();
  }, []);

  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplaySpeed: 1500
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (bookData.length === 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className='slide-container'>
      <Slider {...settings}>
        {bookData.map((book, index) => {
          return <BookCard key={index} book={book} />;
        })}
      </Slider>
    </div>
  );
}

export default TopBooks;
