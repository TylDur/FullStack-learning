import java.util.Scanner;;

public class ScannerDemo {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in); 

        System.out.print("Enter your name: ");
        String name = sc.nextLine();      // Reads String 

        System.out.print("Enter your age: ");
        int age = sc.nextInt();      // Reads Int 

        System.out.print("Enter your gender: ");
        char gender = sc.next().charAt(0);      // Reads Char

        System.out.print("Enter the price: ");
        float price = sc.nextFloat();      // Reads Float

        System.out.print("Enter your discount: ");
        double discount = sc.nextDouble();      // Reads Double

        System.out.print("Enter the total: ");
        long total = sc.nextLong();

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Gender: " + gender);
        System.out.println("Price: " + price);
        System.out.println("Discount: " + discount);
        System.out.println("Total: "+total);

        sc.close();
        
    }
}
