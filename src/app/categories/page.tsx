"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [token, setToken] = useState('no token');
  const [pageRange, setPageRange] = useState({ start: 1, end: 5 });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        alert("unauthorized user");
        router.push('/login');
      }
    }
  }, []);

  const fetchCategories = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/api/categories?page=${page}&limit=5`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-axestoken': token,
        },
      });
      const data = await response.json();
      setCategories(data.categories);
      setResponseMessage(data.msg);
      setTotalPages(data.pagination.totalPages);

      const userCategoriesResponse = await fetch(`http://localhost:3000/api/user-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-axestoken': token,
        },
      });
      const userCategoriesData = await userCategoriesResponse.json();
      const selected = {};
      userCategoriesData.forEach(cat => {
        selected[cat.categoryId] = true;
      });
      setSelectedCategories(selected);
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred');
    }
  };

  useEffect(() => {
    if (token !== 'no token') {
      fetchCategories(page);
    }
  }, [page, token]);

  const handleCheckboxChange = async (categoryId) => {
    const updatedSelectedCategories = {
      ...selectedCategories,
      [categoryId]: !selectedCategories[categoryId],
    };
    setSelectedCategories(updatedSelectedCategories);

    try {
      await fetch(`http://localhost:3000/api/user-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-axestoken': token,
        },
        body: JSON.stringify({ categoryId, selected: updatedSelectedCategories[categoryId] }),
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updatePageRange = (newPage) => {
    const rangeSize = 5;
    const start = Math.floor((newPage - 1) / rangeSize) * rangeSize + 1;
    const end = Math.min(start + rangeSize - 1, totalPages);
    setPageRange({ start, end });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updatePageRange(newPage);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Please mark your interests!</h1>
        <p className="mb-4 text-center">We will keep you notified.</p>
        <h3 className="mb-4 font-bold">My saved interests!</h3>
        {/* {responseMessage && <p className="text-center">{responseMessage}</p>} */}
        {categories && categories.map((category) => (
          <label key={category.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategories[category.id] || false}
              onChange={() => handleCheckboxChange(category.id)}
              className="mr-2"
            />
            {category.name}
          </label>
        ))}
        <div className="flex justify-center items-center space-x-1 text-gray-500 mt-4">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className={`p-2 ${page === 1 ? 'text-gray-300' : 'hover:text-black'}`}
          >
            {'<<'}
          </button>
          <button
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className={`p-2 ${page === 1 ? 'text-gray-300' : 'hover:text-black'}`}
          >
            {'<'}
          </button>
          {[...Array(pageRange.end - pageRange.start + 1).keys()].map((number) => (
            <button
              key={number + pageRange.start}
              onClick={() => handlePageChange(number + pageRange.start)}
              className={`p-2 ${number + pageRange.start === page ? 'font-bold text-black' : 'hover:text-black'}`}
            >
              {number + pageRange.start}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className={`p-2 ${page === totalPages ? 'text-gray-300' : 'hover:text-black'}`}
          >
            {'>'}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className={`p-2 ${page === totalPages ? 'text-gray-300' : 'hover:text-black'}`}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
