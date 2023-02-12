
  let companyResumes = {
    1: [],
    2: [],
    3: [],
  };

  let inputs = document.querySelectorAll("input[type='file']");
  inputs.forEach(input => {
    input.addEventListener("change", event => {
      let id = parseInt(event.target.id.split("-")[1]);
      companyResumes[id].push(event.target.files[0]);
      updatePieChart();
    });
  });

  function updatePieChart() {
    let pieChartData = [];
    for (let company in companyResumes) {
      pieChartData.push(companyResumes[company].length);
    }

    let pieChart = new Chart(document.getElementById("pie-chart"), {
      type: "pie",
      data: {
        labels: ["Company 1", "Company 2", "Company 3"],
        datasets: [
          {
            data: pieChartData,
            backgroundColor: ["#36a2eb", "#ffcd56", "#4bc0c0"],
          },
        ],
      },
      options: {
        legend: {
          position: "bottom",
        },
      },
    });
  }