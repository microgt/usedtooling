package com.andersontoolinginc.fbgrabber;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static com.google.common.io.ByteStreams.toByteArray;

@SpringBootApplication
@EnableScheduling
public class FbgrabberApplication implements CommandLineRunner {

	@Autowired
	private EquipmentService equipmentService;

	public static void main(String[] args) {
		SpringApplication.run(FbgrabberApplication.class, args);
    }

	@Override
	public void run(String... args) throws Exception {
	}

	@Scheduled(cron = "0 1 17 * * ?")
	private void getWithSelenium(){
		WebDriverManager.chromedriver().setup();
		WebDriver driver = new ChromeDriver();
		String url = "https://www.facebook.com/marketplace/profile/100001288343686/";
		driver.get(url);
		WebElement element = driver.findElement(By.cssSelector(".x1n2onr6"));
		List<WebElement> elementList = element.findElements(By.cssSelector(".x1i10hfl"));
		List<String> links = new ArrayList<>();
		for(int x = elementList.size() -1; x >= 0; x--){
			if(elementList.get(x).getAttribute("href") == null) break;
			links.add(elementList.get(x).getAttribute("href"));
		}
		driver.quit();
		getIndividualListings(links);
	}
	public void getIndividualListings(List<String> links){
		List<Equipment> listings = new ArrayList<>();
		links.forEach(link ->{
			WebDriverManager.chromedriver().setup();
			WebDriver driver = new ChromeDriver();
			driver.get(link);

			String title = driver.findElement(By.cssSelector("h1 > .x193iq5w")).getText();
			String price = driver.findElement(By.cssSelector(".x1xmf6yo > div > .x193iq5w")).getText().split("\\$")[1].split(" . ")[0].replace(",", "").replace("\n ", "");
			String description = driver.findElement(By.cssSelector(".xz9dl7a> div> span")).getText();

			List<String> pics = new ArrayList<>();
			driver.findElements(By.cssSelector(".x1ypdohk> img")).forEach(p -> pics.add(p.getAttribute("src")));
			driver.findElements(By.cssSelector("video")).forEach(v -> pics.add(v.getAttribute("src")));
			System.out.println(pics.toString());

			Equipment l = new Equipment(title, EquipmentCategories.MISCELLANEOUS_EQUIPMENT_AND_MACHINES, description, Double.parseDouble(price), true);
			Equipment existing = null;
					if(!equipmentService.getEquipmentByName(title).isEmpty()) existing = equipmentService.getEquipmentByName(title).get(0);


					List<MultipartFile> files = new ArrayList<>();
					pics.forEach(pic -> {
                        try {
                            files.add(createMultipartFileFromUrl(pic));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });

			if(existing != null){
				l.setId(existing.getId());
				l.setCategory(existing.getCategory());
			}
			listings.add(l);
			saveListing(l, files);

			driver.quit();
		});
		purgeDeletedListings(listings);
	}

	private void purgeDeletedListings(List<Equipment> fbListings){
		List<Equipment> existingListings = equipmentService.getAllEquipment(0, 999).getContent();

		for(Equipment e : existingListings){
			if(e.isFBListing() && !fbListings.contains(e)) equipmentService.deleteEquipment(String.valueOf(e.getId()));
		}
	}

	private void saveListing(Equipment e, List<MultipartFile> pics){
		String url = "https://www.usedtooling.com/api/addequipment";

        try(CloseableHttpClient httpClient = HttpClients.createDefault()){
			HttpPost httpPost = new HttpPost(url);
			MultipartEntityBuilder builder = MultipartEntityBuilder.create();
			builder.addTextBody("id", String.valueOf(e.getId()) != "null"? String.valueOf(e.getId()) : "", ContentType.TEXT_PLAIN);
			builder.addTextBody("name", e.getName(), ContentType.TEXT_PLAIN);
			builder.addTextBody("description", e.getDescription(), ContentType.TEXT_PLAIN);
			builder.addTextBody("category", String.valueOf(e.getCategory()), ContentType.TEXT_PLAIN);
			builder.addTextBody("price", String.valueOf(e.getPrice()), ContentType.TEXT_PLAIN);
			for(MultipartFile file : pics){
				builder.addBinaryBody("pics", toByteArray(file.getInputStream()), ContentType.APPLICATION_OCTET_STREAM, file.getOriginalFilename());
			}
			HttpEntity multiplart = builder.build();
			httpPost.setEntity(multiplart);
			try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
				HttpEntity responseEntity = response.getEntity();
				String responseBody = EntityUtils.toString(responseEntity);
				System.out.println("Response Body: " + responseBody);
			}
		}catch (Exception ex){
			System.out.println(ex.getMessage());
		}
    }

	private MultipartFile createMultipartFileFromUrl(String fileUrl) throws IOException {
		URL url = new URL(fileUrl);
		InputStream inputStream = url.openStream();

		// Extract filename from URL
		String[] urlParts = fileUrl.split("/");
		String filename = urlParts[urlParts.length - 1].substring(0, 9);

		return new MultipartFile() {
			@Override
			public String getName() {
				return filename;
			}

			@Override
			public String getOriginalFilename() {
				return filename;
			}

			@Override
			public String getContentType() {
				// Set content type based on file extension or other logic if needed
				return "application/octet-stream";
			}

			@Override
			public boolean isEmpty() {
				return false; // Always false since we're reading from a URL
			}

			@Override
			public long getSize() {
				try {
					return inputStream.available();
				} catch (IOException e) {
					return 0;
				}
			}

			@Override
			public byte[] getBytes() throws IOException {
				return StreamUtils.copyToByteArray(inputStream);
			}

			@Override
			public InputStream getInputStream() throws IOException {
				return inputStream;
			}

			@Override
			public void transferTo(File dest) throws IOException, IllegalStateException {
				throw new UnsupportedOperationException("Not implemented");
			}
		};
	}
}
