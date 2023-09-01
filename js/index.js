document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = {
        all: document.getElementById("allButton"),
        music: document.getElementById("musicButton"),
        comedy: document.getElementById("comedyButton"),
        drawing: document.getElementById("drawingButton"),
    };

    const cardContainer = document.getElementById("card-container");
    const categoryContainer = document.getElementById("category-container");

    const fetchAndDisplayCategoryData = async () => {
        const categoriesUrl =
            "https://openapi.programming-hero.com/api/videos/categories";

        try {
            const response = await fetch(categoriesUrl);
            const responseData = await response.json();

            if (response.ok) {
                const categories = responseData.data;

                categories.forEach((category) => {
                    const categoryButton = document.createElement("button");
                    categoryButton.classList.add(
                        "bg-gray-100",
                        "border",
                        "stroke-lime-50",
                        "w-16"
                    );
                    categoryButton.textContent = category.category;
                    categoryButton.setAttribute(
                        "data-category-id",
                        category.category_id
                    );

                    categoryButton.addEventListener("click", () => {
                        fetchAndDisplayVideoData(category.category_id);
                    });

                    categoryContainer.appendChild(categoryButton);
                });
            } else {
                console.error(
                    "Failed to fetch categories:",
                    responseData.message
                );
            }
        } catch (error) {
            console.error(
                "An error occurred while fetching categories:",
                error
            );
        }
    };

    const fetchAndDisplayVideoData = async (categoryId) => {
        const categoryUrl = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;

        try {
            const response = await fetch(categoryUrl);
            const responseData = await response.json();

            if (response.ok) {
                const videos = responseData.data;

                cardContainer.innerHTML = ""; // Clear existing cards

                videos.forEach((video) => {
                    const card = document.createElement("div");
                    card.classList.add("card", "w-72", "bg-gray-100");

                    const authorsHtml = video.authors
                        .map(
                            (author) => `
                                <div class="author">
                                    <p class="flex items-center">
                                        ${author.profile_name}
                                        ${
                                            author.profile_name
                                                ? '<img src="./verified img.jpg" alt="Verified" class="w-4 h-4 ml-1" />'
                                                : ""
                                        }
                                    </p>
                                    <img src="${author.profile_picture}" alt="${
                                author.profile_name
                            }" class="w-10 h-10 rounded-3xl " />
                                </div>
                            `
                        )
                        .join("");

                    const postedDate = new Date(
                        video.others.posted_date * 1000
                    ); // Multiply by 1000 to convert to milliseconds

                    function formatTime(date) {
                        const options = {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        };
                        return date.toLocaleString("en-US", options);
                    }

                    const formattedTime = formatTime(postedDate);

                    card.innerHTML = `
                        <div class="thumbnail-container relative">
                            <figure>
                                <img src="${video.thumbnail}" alt="${video.title}" />
                            </figure>
                            <p class="posted-time-badge absolute bottom-0 right-0 bg-gray-200 p-1 text-xs">
                                ${formattedTime}
                            </p>
                        </div>
                        <div class="card-body">
                            <h2 class="card-title">${video.title}</h2>
                            <div class="authors">${authorsHtml}</div>
                            <p>Views: ${video.others.views}</p>
                        </div>
                    `;

                    cardContainer.appendChild(card);
                });
            } else {
                console.error(
                    `Failed to fetch data for category ${categoryId}`
                );
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };

    fetchAndDisplayCategoryData();
});
