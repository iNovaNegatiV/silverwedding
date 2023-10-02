<?php

// Connector class
class Connector {
  // Connector Konstruktor
  function __construct(
    private string $servername = "localhost",
    private string $adminPassToken = "SockenFeier#2023?!",
    // private string $username = "id21082841_root",
    // private string $password = "Finita17310!",
    // private string $database = "id21082841_silberfeier"
    private string $username = "u334874850_root",
    private string $password = "Xg8QP?23Meme!",
    private string $database = "u334874850_silverwedding"
  ) {}

  // Returns new Mysqli connection
  function getNewConnection(): mysqli {
    // Create connection
    $db_conn = new mysqli($this->servername, $this->username, $this->password, $this->database);

    // Check connection
    if ($db_conn->connect_error) {
      echo json_encode([
        'status' => 'failed',
        'login' => false
      ]);
      die("Connection failed: " . $db_conn->connect_error);
    }
    return $db_conn;
  }

  // Gets POST data
  function getPostData(): array {
    // Get post data
    $json_decoded_data = json_decode(file_get_contents('php://input'), true);
    $folder_to_save_images = "failed_uploads";
    $sw_type = null;
    $sw_data = [];

    if(isset($json_decoded_data['type'])) {
      $sw_type = $json_decoded_data['type'];
    }

    if(isset($json_decoded_data['data'])) {
      $sw_data = $json_decoded_data['data'];
    }

    if(isset($_FILES['file']['name'])) {
      $sw_type = "sw_upload";
    }

    if(isset($_POST['folder'])) {
      $folder_to_save_images = $_POST['folder'];
    }

    $sw_data['folder'] = $folder_to_save_images;

    return [
      'sw_type' => $sw_type,
      'sw_data' => $sw_data
    ];
  }

  // Adds new participant to the database
  function addParticipant(array $data): string {
    $conn = $this->getNewConnection();
    $name = strval($data['name']);
    $status = intval($data['status']);
    $number = intval($data['number']);
    $datetime = date_create()->format('Y-m-d H:i:s');

    // Create query
    $sql = "INSERT INTO guests (id, username, g_amount, status, timestamp) VALUES (null, '$name', '$number', '$status', '$datetime')";

    // Executes query
    $conn->query($sql);

    // Close connection
    $conn->close();

    return json_encode([
      'status' => 'ok'
    ]);
  }

  // Add new Guestbook entry
  function addGuestbookEntry(array $data): string {
    $conn = $this->getNewConnection();
    $name = $data['name'];
    $bodytext = $data['bodytext'];
    $hasFile = $data['file'];
    $filepath = $data['filepath'];

    // Create query
    $sql = "INSERT INTO guestbook (id, username, bodytext, image, link)
            VALUES (null, '$name', '$bodytext', '$hasFile', '$filepath')
    ";

    // Executes query
    $conn->query($sql);

    // Close connection
    $conn->close();

    return json_encode([
      'status' => 'ok'
    ]);
  }

  // Login function
  function checkPassword(array $data): string {
    $login = false;
    if($data['password'] == $this->adminPassToken) {
      $login = true;
    }
    return json_encode([
      'status' => 'ok',
      'login' => $login
    ]);
  }

  // Uploads images and videos to ./upload
  function uploadFile(array $data): string {
    $sw_response = 0;
    $valid_extension = false;
    if(isset($_FILES['file']['name'])) {
      // file name
      $filename = $_FILES['file']['name'];
      $folder_to_save_images = $data['folder'];

      // Location
      $location = '../assets/'.$folder_to_save_images.'/'.$filename;

      if($folder_to_save_images == 'gallery') {
        $this->addGalleryFile($filename, $location);
      }

      // file extension
      $file_extension = pathinfo($location, PATHINFO_EXTENSION);
      $file_extension = strtolower($file_extension);

      // Valid extensions
      $valid_ext = array("jpg","png","jpeg", "gif", "tiff", "webp", "mp4", "mov", "webm", "wmv", "avi");

      if(in_array($file_extension, $valid_ext)) {
        $valid_extension = true;
        if (is_uploaded_file($_FILES['file']['tmp_name'])) {
          move_uploaded_file($_FILES['file']['tmp_name'], $location);
          $sw_response = 1;
        }
      }
    }
    return json_encode([
      'status' => 'ok',
      'success' => $sw_response,
      'valid_ext' => $valid_extension
    ]);
  }

  function addGalleryFile(string $filename, string $filepath): void {
    // Get SQL Connection
    $conn = $this->getNewConnection();
    // Create query
    $sql = "INSERT INTO gallery (id, filename, filepath)
            VALUES (null, '$filename', '$filepath')
    ";

    // Executes query
    $conn->query($sql);

    // Close connection
    $conn->close();
  }

  // Get AdminPanelData
  function getAdminData(array $data): string {
    // Connection
    $conn = $this->getNewConnection();

    // Select guests
    $sql = "SELECT * FROM guests";
    $result = $conn->query($sql);

    // Participants
    $participants = [];
    if ($result->num_rows > 0) {
      $counter = 1;
      while($row = $result->fetch_assoc()) {
        $participant = [
          "n" => $counter,
          "row_id" => $row["id"],
          "username" => $row["username"],
          "g_amount" => $row["g_amount"],
          "status" => $row["status"],
          "timestamp" => $row["timestamp"],
        ];
        $participants[] = $participant;
        $counter++;
      }
    }

    // Select guestbooks
    $sql = "SELECT * FROM guestbook";
    $result = $conn->query($sql);

    // Participants
    $guestbooks = [];
    if ($result->num_rows > 0) {
      $counter = 1;
      while($row = $result->fetch_assoc()) {
        $guestbook = [
          "n" => $counter,
          "row_id" => $row["id"],
          "username" => $row["username"],
          "bodytext" => $row["bodytext"],
          "image" => $row["image"],
          "link" => $row["link"]
        ];
        $guestbooks[] = $guestbook;
        $counter++;
      }
    }

    $conn->close();
    return json_encode([
      'participants' => $participants,
      'guestbooks' => $guestbooks
    ]);
  }

  function getGalleryImages(): string {
    // Connection
    $conn = $this->getNewConnection();

    // Select gallery images
    $sql = "SELECT * FROM gallery";
    $result = $conn->query($sql);

    // Images
    $images = [];
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $image = [
          "id" => $row["id"],
          "name" => $row["filename"],
          "path" => $row["filepath"]
        ];
        $images[] = $image;
      }
    }

    return json_encode([
      'images' => $images,
      'status' => 'ok'
    ]);
  }
}

// Initiate Connector class
$connector = new Connector();

// Get POST data
$post_data = $connector->getPostData();

if($post_data['sw_type'] == null) {
  exit(0);
}

// Class function executor
$executor = [
  "sw_participation" => "addParticipant",
  "sw_guestbook" => "addGuestbookEntry",
  "sw_upload" => "uploadFile",
  "sw_password_check" => "checkPassword",
  "sw_gallery_grab" => "getGalleryImages",
  "sw_data_grab" => "getAdminData"
];

// Declare data
$sw_type = $post_data['sw_type'];
$sw_data = $post_data['sw_data'];
$response = call_user_func_array(array($connector, $executor[$sw_type]), array($sw_data));

// Returns json
echo $response;
