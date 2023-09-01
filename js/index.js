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
                    const authorsHtml = video.authors
                        .map(
                            (author) => `
                                <div class="author">
                                    <img src="${
                                        author.profile_picture
                                    } " class="w-10 h-10" " alt="${
                                author.profile_name
                            }" />
                                    <p>${author.profile_name}</p>
                                    <p>Verified: ${
                                        author.verified ? "Yes" : "No"
                                    }</p>
                                </div>
                            `
                        )
                        .join("");

                    const card = document.createElement("div");
                    card.classList.add("card", "w-72", "bg-gray-100");

                    card.innerHTML = `
                        <figure>
                            <img src="${video.thumbnail}" alt="${video.title}" />
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">${video.title}</h2>
                            <div class="authors">${authorsHtml}</div>
                            <p>Views: ${video.others.views}</p>
                            <p>Posted Date: ${video.others.posted_date}</p>
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
